import functions from 'firebase-functions';
import { BigQuery } from '@google-cloud/bigquery';
import { promises as dns } from 'dns';
import { request } from 'undici';
import { GoogleAuth } from 'google-auth-library';
import { sheets as sheets_v4 } from '@googleapis/sheets';
import { buffer } from 'stream/consumers';
import { Readable } from 'stream';

const config = functions.config();
const ACTIONS = { PASS: 'pass', BLOCK: 'block' };
const REJECT_REDIRECT_URL = config.mailcheck?.reject_redirect_url;
const params = {
    open: {
        BQ_DATASET: config.mailcheck?.bq_mail_open_dataset,
        BQ_TABLE: config.mailcheck?.bq_mail_open_table,
        txtDomain: config.mailcheck.dns_txt_image_domain,
        getSubdomain: q => q.image,
        metaRedirect: (res, redirectUrl) => res.redirect(redirectUrl),
        table: null
    },
    link: {
        BQ_DATASET: config.mailcheck?.bq_mail_link_dataset,
        BQ_TABLE: config.mailcheck?.bq_mail_link_table,
        txtDomain: config.mailcheck.dns_txt_redirect_domain,
        getSubdomain: q => q.redirect,
        metaRedirect: (res, redirectUrl) => res.status(200).send(`<html><head><meta http-equiv="refresh" content="0;URL='${redirectUrl}'" /></head></html>`),
        table: null
    },
};
const dnsLinkCache = new Map();
const dnsImageCache = new Map();

try {
  const bigQuery = new BigQuery({ projectId: config.mailcheck.bq_project_id });
  params.open.table = bigQuery.dataset(params.open.BQ_DATASET).table(params.open.BQ_TABLE);
  params.link.table = bigQuery.dataset(params.link.BQ_DATASET).table(params.link.BQ_TABLE);
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
async function getRedirectUrl(subdomain, txtDomain) {
  const fullDomain = `${subdomain}.${txtDomain}`;
  let cachedUrl = dnsLinkCache.get(fullDomain);
  if (!cachedUrl) {
    const txts = await dns.resolveTxt(fullDomain);
    cachedUrl = new URL(txts.map((row) => row.join('')).join(''));
    dnsLinkCache.set(fullDomain, cachedUrl);
  }
  return cachedUrl;
}

const inflateRedirectUrl = (r, q) => Object.entries(q).reduce(
  (acc, val) => acc.replace(`<${val[0]}>`, val[1]),
  decodeURI(r.toString())
);

/**
 * @param {string} subdomain
 * @return {Promise<buffer>}
 */
 async function getImage(subdomain, txtDomain) {
  const fullDomain = `${subdomain}.${txtDomain}`;
  let image = dnsImageCache.get(fullDomain)?.deref();
  if (!image) {
    const txts = await dns.resolveTxt(fullDomain);
    const imageUrl = new URL(txts.map((row) => row.join('')).join(''));
    const imageResponse = await request(imageUrl);
    image = await buffer(imageResponse.body);
    const imageRef = new WeakRef(image);
    dnsImageCache.set(fullDomain, imageRef);
  }
  return image;
}

/**
 * @param {string} ip
 * @return {Promise<any>}
 */
async function getAsn(ip) {
  try {
    const res = await request(`https://iptoasn-webservice.vercel.app/api/${ip}`);
    const json = await res.body.json();
    const {as_country_code, as_description, as_number} = json;
    return {as_country_code, as_description, as_number};
  } catch (e) {
    return {as_country_code: null, as_description: null, as_number: null};
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
      const res = await sheets.spreadsheets.values.get({spreadsheetId: config.sheets.sheet_id, range: config.sheets.ua_range});
      uaBlocks = res.data.values.map(e => [new RegExp(e[0]), e[1]]);
    }
    const match = uaBlocks.find(e => e[0].test(user_agent));
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
      const res = await sheets.spreadsheets.values.get({spreadsheetId: config.sheets.sheet_id, range: config.sheets.asn_range});
      asnBlocks = {
        numbers: res.data.values.filter(e => e[0] === 'num').map(e => [parseInt(e[1]), e[2]]),
        regex: res.data.values.filter(e => e[0] === 'regex').map(e => [new RegExp(e[1]), e[2]]),
      };
    }
    const numMatch = asnBlocks.numbers.find(e => e[0] === asn.as_number);
    if (numMatch) {
      return numMatch[1];
    }
    const regexMatch = asnBlocks.regex.find(e => e[0].test(asn.as_description));
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
  // open or link
  const decodedParams = Buffer.from(req.path.split('/')[2], 'base64').toString();
  const type = decodedParams.split('?')[0];
  if (!['open', 'link'].includes(type)) {
    return res.redirect(REJECT_REDIRECT_URL);
  }

  const queryString = '?' + decodedParams.split('?').slice(1).join('?');
  const query = [...(new URLSearchParams(queryString)).entries()].reduce((a,v) => (a[v[0]] = v[1], a), {});
  const typeParams = params[type];
  const redirectSubdomain = typeParams.getSubdomain(query) ?? '*';
  const ip = req.get('cf-connecting-ip') ?? req.get('fastly-client-ip');
  const asn = await getAsn(ip);
  const user_agent = req.get('User-Agent');
  const ua_action = await resolveUaAction(user_agent);
  const asn_action = await resolveAsnAction(asn);
  const geo = req.get('cf-ipcountry');
  const campaign = query.campaign;
  const row = {
    timestamp: new Date(),
    click_id: String(query.click_id),
    user_agent,
    ip,
    email: query.email,
    campaign,
    geo,
    domain: req.get('x-forwarded-host'),
    ...asn
  };
  if (type === 'link') {
    row.redirect = query.redirect;
    row.place_click = query.place_click;
  }
  const isBlocked = ua_action === ACTIONS.BLOCK || asn_action === ACTIONS.BLOCK;
  const status = isBlocked ? ACTIONS.BLOCK : ACTIONS.PASS;
  try {
    if (type === 'open') {
      const image = await getImage(redirectSubdomain, typeParams.txtDomain);
      await typeParams.table.insert({...row, status});
      res.header('cache-control', 'no-cache');
      Readable.from(image).pipe(res);
      return;
    } else {
      const redirectUrl = await getRedirectUrl(redirectSubdomain, typeParams.txtDomain);
      const inflatedRedirectUrl = isBlocked ? REJECT_REDIRECT_URL : inflateRedirectUrl(redirectUrl, query);
      await typeParams.table.insert({...row, status});
      res.redirect(inflatedRedirectUrl);
      return;
    }
  } catch (err) {
    functions.logger.error(err);
    res.status(500).end();
  }
}
