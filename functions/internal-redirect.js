import functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';
import { promises as dns } from 'dns';
import admin from 'firebase-admin';

const redirectCache = new Map();
const config = functions.config();
admin.initializeApp(config.firebase);

const BQ_DATASET = config.mailcheck?.bq_redirects_dataset;
const BQ_TABLE = config.mailcheck?.bq_redirects_table;
const L_MAILCHECK = 'l.mailcheck.co';

let fallbackUrlBase = '';

let bigQueryRedirectsTable;
try {
  const bigQuery = new BigQuery({ projectId: config.mailcheck.bq_project_id });
  bigQueryRedirectsTable = bigQuery.dataset(BQ_DATASET).table(BQ_TABLE);
} catch (err) {
  functions.logger.error(err);
}

/**
 * @param hostname {string}
 */
async function initFallbackUrl() {
  if (fallbackUrlBase) return;
  try {
    const chunks = await dns.resolveTxt(`*.${L_MAILCHECK}`);
    fallbackUrlBase = new URL(chunks.join(''));
  } catch (err) {
    functions.logger.error(err);
  }
}

/**
 * @param url {URL}
 */
function requestUrlToHostname(url) {
  const match = url.pathname.match(/^\/l\/([^\s\\]+)$/);
  if (!match) {
    return;
  }
  return match[1];
}

/**
 * @param hostname {string}
 * @return {Promise<URL>}
 */
async function getRedirectUrlFromTxtRecord(hostname) {
  const cachedData = redirectCache.get(hostname);
  if (cachedData) return new URL(cachedData);
  const txts = await dns.resolveTxt(hostname);
  const redirectUrl = new URL(txts.map((row) => row.join('')).join(''));
  redirectCache.set(hostname, redirectUrl.href);
  return redirectUrl;
}

/**
 * @param redirectUrl {URL}
 * @param requestUrl {URL}
 * @return {URL}
 */
function mergeUrls(redirectUrl, requestUrl) {
  const result = new URL(redirectUrl);
  for (const [key, value] of requestUrl.searchParams) {
    result.searchParams.set(key, value);
  }
  return result;
}

/**
 * @param req {functions.https.Request}
 * @param redirectUrl {URL}
 */
async function logToBigQuery(req, redirectUrl, key) {
  const row = {
    timestamp: new Date(),
    useragent: req.get('User-Agent'),
    ip: req.get('CF-Connecting-IP'),
    geo_ip: req.get('CF-IPCountry'),
    path: req.originalUrl,
    key,
    redirecturl: redirectUrl.href,
    referrer: req.get('Referer')
  };
  try {
    await bigQueryRedirectsTable?.insert(row);
  } catch (err) {
    functions.logger.error(err);
  }
}

export default async function (req, res) {
  const requestUrl = new URL(`${req.protocol}://${req.hostname}${req.originalUrl}`);
  await initFallbackUrl();
  const fallbackUrl = new URL(fallbackUrlBase);
  const matchKey = requestUrlToHostname(requestUrl);
  if (!matchKey) {
    return res
      .status(200)
      .send(
        `<html><head><meta http-equiv="refresh" content="0;URL='${fallbackUrl}'" /></head></html>`
      );
  }

  try {
    let redirectUrl = await getRedirectUrlFromTxtRecord(`${matchKey}.${L_MAILCHECK}`);
    redirectUrl.searchParams.set('from', matchKey);
    redirectUrl = mergeUrls(redirectUrl, requestUrl);
    functions.logger.info(`${requestUrl} => ${redirectUrl}`);
    await logToBigQuery(req, redirectUrl, matchKey);
    res
      .status(200)
      .send(
        `<html><head><meta http-equiv="refresh" content="0;URL='${redirectUrl}'" /><link rel="canonical" href="https://mailcheck.co"/><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Expires" content="0" /></head></html>`
      );
  } catch (err) {
    // Someone messed up with TXT records
    res.status(500).end(err.message);
    return;
  }
}
