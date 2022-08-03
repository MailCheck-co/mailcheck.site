import functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';
import { promises as dns } from 'dns';
import { request } from 'undici';
import { GoogleAuth } from 'google-auth-library';
import { sheets as sheets_v4 } from '@googleapis/sheets';

const config = functions.config();
const ACTIONS = { PASS: 'pass', BLOCK: 'block' };
const REJECT_REDIRECT_URL = config.mailcheck?.reject_redirect_url;
const BQ_DATASET = config.mailcheck?.bq_mail_link_dataset;
const BQ_TABLE = config.mailcheck?.bq_mail_link_table;
const dnsCache = new Map();

/** @type {import('@google-cloud/bigquery').Table} */
let bigQueryEmailOpenTable;
try {
  const bigQuery = new BigQuery({ projectId: config.mailcheck.bq_project_id });
  bigQueryEmailOpenTable = bigQuery.dataset(BQ_DATASET).table(BQ_TABLE);
} catch (err) {
  functions.logger.error(err);
}

/** @type {import('@googleapis/sheets').sheets_v4.Sheets} */
let sheets;
let asnBlocks;
let uaBlocks;
try {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  sheets = sheets_v4({ version: 'v4', auth });
} catch (err) {
  functions.logger.error(err);
}

/**
 * @param {string} subdomain
 * @return {Promise<URL>}
 */
async function getRedirectUrl(subdomain) {
  const fullDomain = `${subdomain}.${config.mailcheck.dns_txt_redirect_domain}`;
  let cachedUrl = dnsCache.get(fullDomain);
  if (!cachedUrl) {
    const txts = await dns.resolveTxt(fullDomain);
    cachedUrl = new URL(txts.map((row) => row.join('')).join(''));
    dnsCache.set(fullDomain, cachedUrl);
  }
  return cachedUrl;
}

/**
 * @param {string} ip
 * @return {Promise<any>}
 */
async function getAsn(ip) {
  try {
    const res = await request(`https://iptoasn-webservice.vercel.app/api/${ip}`);
    const json = await res.body.json();
    const { as_country_code, as_description, as_number } = json;
    return { as_country_code, as_description, as_number };
  } catch (e) {
    return { as_country_code: null, as_description: null, as_number: null };
  }
}

/**
 * @param {string} user_agent
 * @return {Promise<string>}
 */
async function resolveUaAction(user_agent) {
  if (!user_agent) return ACTIONS.PASS;
  try {
    if (!uaBlocks) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: config.sheets.sheet_id,
        range: config.sheets.ua_range
      });
      uaBlocks = res.data.values.map((e) => [new RegExp(e[0]), e[1]]);
    }
    const match = uaBlocks.find((e) => e[0].test(user_agent));
    if (match) {
      return match[1];
    }
  } catch (err) {
    functions.logger.error(err);
  }
  return ACTIONS.PASS;
}

/**
 * @param {any} asn
 * @return {Promise<string>}
 */
async function resolveAsnAction(asn) {
  if (!asn) return ACTIONS.PASS;
  try {
    if (!asnBlocks) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: config.sheets.sheet_id,
        range: config.sheets.asn_range
      });
      asnBlocks = {
        numbers: res.data.values.filter((e) => e[0] === 'num').map((e) => [parseInt(e[1]), e[2]]),
        regex: res.data.values.filter((e) => e[0] === 'regex').map((e) => [new RegExp(e[1]), e[2]])
      };
    }
    const numMatch = asnBlocks.numbers.find((e) => e[0] === asn.as_number);
    if (numMatch) {
      return numMatch[1];
    }
    const regexMatch = asnBlocks.regex.find((e) => e[0].test(asn.as_description));
    if (regexMatch) {
      return regexMatch[1];
    }
  } catch (err) {
    functions.logger.error(err);
  }
  return ACTIONS.PASS;
}

/**
 * @param {functions.Request} req
 * @param {functions.Response} res
 */
export default async function (req, res) {
  const redirectSubdomain = req.query.redirect ?? '*';
  const ip = req.get('cf-connecting-ip') ?? req.get('fastly-client-ip');
  const asn = await getAsn(ip);
  const user_agent = req.get('User-Agent');
  const ua_action = await resolveUaAction(user_agent);
  const asn_action = await resolveAsnAction(asn);
  const geo = req.get('cf-ipcountry');
  const campaign = req.query.campaign;
  const row = {
    timestamp: new Date(),
    click_id: String(req.query.click_id),
    user_agent,
    ip,
    email: req.query.email,
    redirect: req.query.redirect,
    place_click: req.query.place_click,
    campaign,
    geo,
    domain: req.get('x-forwarded-host'),
    ...asn
  };
  let redirectUrl;
  let status;
  try {
    if (ua_action === ACTIONS.BLOCK || asn_action === ACTIONS.BLOCK) {
      redirectUrl = await getRedirectUrl(redirectSubdomain);
      redirectUrl = Object.entries(req.query).reduce(
        (acc, val) => acc.replace(`<${val[0]}>`, val[1]),
        decodeURI(redirectUrl.toString())
      );
      status = ACTIONS.BLOCK;
    } else {
      redirectUrl = await getRedirectUrl(redirectSubdomain);
      redirectUrl = Object.entries(req.query).reduce(
        (acc, val) => acc.replace(`<${val[0]}>`, val[1]),
        decodeURI(redirectUrl.toString())
      );
      status = ACTIONS.PASS;
    }
  } catch (err) {
    functions.logger.warn(err);
    return res.status(400).end();
  }
  try {
    await bigQueryEmailOpenTable?.insert({ ...row, status });
    res.redirect(redirectUrl);
  } catch (err) {
    functions.logger.error(err);
    res.status(500).end();
  }
}
