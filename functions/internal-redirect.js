const functions = require('firebase-functions');
const { promises: dns } = require('dns');

const redirectCache = new Map();

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
    const mergedUrl = mergeUrls(redirectUrl, requestUrl);
    functions.logger.info(`${requestUrl} (${hostname}) => ${mergedUrl}`);
    res.set('Location', mergedUrl).status(302).end();
    await new Promise((resolve) => {
      res.once('finish', resolve);
    });
  } catch (err) {
    // Someone messed up with TXT records
    res.status(500).end(err.message);
    return;
  }

  // TODO: log request to BQ
});
