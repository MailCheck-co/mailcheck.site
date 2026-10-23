// Response policy applied to every Worker response, including redirects and
// errors that Astro produces before user middleware runs. Workers Cache keys
// ignore the hostname, so nothing here may depend on it: indexability is a
// per-deployment variable, not a host check.

export interface EdgeEnv { MAILCHECK_INDEXABLE?: string; }

// The former Firebase Hosting policy for every public response.
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'no-referrer-when-downgrade',
  'X-UA-Compatible': 'ie=edge',
  'X-XSS-Protection': '1; mode=block'
};

export const isIndexable = (env: EdgeEnv | undefined) => env?.MAILCHECK_INDEXABLE === 'true';

export function legacyRedirect(url: URL): Response | null {
  // Firebase `cleanUrls` answered /index.html with a 301 to /.
  if (url.pathname === '/index.html') {
    return new Response(null, { status: 301, headers: { Location: `/${url.search}`, 'Cache-Control': 'max-age=3600' } });
  }
  return null;
}

export function finalizeResponse(response: Response, url: URL, env: EdgeEnv | undefined): Response {
  const isAdmin = url.pathname.startsWith('/_emdash');
  const missing = isAdmin ? [] : Object.keys(securityHeaders).filter((name) => !response.headers.has(name));
  const robots = !isIndexable(env) || isAdmin ? 'noindex, nofollow' : null;
  if (!missing.length && (!robots || response.headers.get('X-Robots-Tag') === robots)) return response;
  // Fetched/cached responses can have immutable headers.
  const result = new Response(response.body, response);
  for (const name of missing) result.headers.set(name, securityHeaders[name]);
  if (robots) result.headers.set('X-Robots-Tag', robots);
  return result;
}
