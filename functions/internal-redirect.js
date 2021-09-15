const functions = require('firebase-functions');
const { BigQuery } = require('@google-cloud/bigquery');
const { promises: dns } = require('dns');

const redirectCache = new Map();
const bigQuery = new BigQuery();
const BQ_DATASET = functions.config().mailcheck?.bq_redirects_dataset;
const BQ_TABLE = functions.config().mailcheck?.bq_redirects_table;

/**
 * @param url {URL}
 */
function requestUrlToHostname(url) {
  const match = url.pathname.match(/^\/l\/([^\s\\]+)$/);
  if (!match) {
    return;
  }
  return `${match[1]}.l.mailcheck.co`;
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
async function logToBigQuery(req, redirectUrl) {
  const row = {
    timestamp: Date.now(),
    useragent: req.get('User-Agent'),
    ip: req.get('CF-Connecting-IP'),
    geo_ip: req.get('CF-IPCountry'),
    path: req.originalUrl,
    redirecturl: redirectUrl.href,
    referrer: req.get('Referrer')
  };
  try {
    await bigQuery.dataset(BQ_DATASET).table(BQ_TABLE).insert(row);
  } catch (err) {
    functions.logger.error(err);
  }
}

exports.internalRedirect = functions.https.onRequest(async (req, res) => {
  const requestUrl = new URL(`${req.protocol}://${req.hostname}${req.originalUrl}`);
  const hostname = requestUrlToHostname(requestUrl);
  if (!hostname) {
    res.status(404).end();
    return;
  }

  let redirectUrl;
  try {
    redirectUrl = await getRedirectUrlFromTxtRecord(hostname);
  } catch (err) {
    res.status(404).end();
    return;
  }

  try {
    redirectUrl = mergeUrls(redirectUrl, requestUrl);
    functions.logger.info(`${requestUrl} (${hostname}) => ${redirectUrl}`);
    res.set('Location', redirectUrl).status(302).end();
    await new Promise((resolve) => {
      res.once('finish', resolve);
    });
    await logToBigQuery(req, redirectUrl);
  } catch (err) {
    // Someone messed up with TXT records
    res.status(500).end(err.message);
    return;
  }
});
