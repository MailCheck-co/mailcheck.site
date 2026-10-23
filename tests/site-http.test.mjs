import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

// HTTP semantics against a deployed Worker: SITE_TEST_URL=https://… npm run test:site-http
// SITE_TEST_INDEXABLE=true when testing the production deployment.
const base = process.env.SITE_TEST_URL;
const indexable = process.env.SITE_TEST_INDEXABLE === 'true';
const get = (path, init = {}) => fetch(new URL(path, base), { redirect: 'manual', ...init });
const security = [['x-content-type-options', 'nosniff'], ['x-frame-options', 'SAMEORIGIN'],
  ['referrer-policy', 'no-referrer-when-downgrade'], ['x-ua-compatible', 'ie=edge'], ['x-xss-protection', '1; mode=block']];

describe('Worker HTTP policy', { skip: !base }, () => {
  it('redirects /index.html to / like Firebase cleanUrls', async () => {
    const response = await get('/index.html');
    assert.equal(response.status, 301);
    assert.equal(new URL(response.headers.get('location'), base).pathname, '/');
  });

  it('keeps the legacy security headers on framework redirects', async () => {
    for (const path of ['/blog/', '/videos/', '/faq/', '/scholarship']) {
      const response = await get(path);
      assert.ok([301, 308].includes(response.status), `${path} ${response.status}`);
      for (const [name, value] of security) assert.equal(response.headers.get(name), value, `${path} ${name}`);
    }
  });

  it('applies the deployment indexability policy', async () => {
    const page = await get('/');
    const robots = await (await get('/robots.txt')).text();
    if (indexable) {
      assert.equal(page.headers.get('x-robots-tag'), null);
      assert.match(robots, /Disallow: \/l\/\*/);
      assert.match(robots, /Sitemap: https:\/\/mailcheck\.co\/sitemap\.xml/);
    } else {
      assert.equal(page.headers.get('x-robots-tag'), 'noindex, nofollow');
      assert.match(robots, /^User-agent: \*\nDisallow: \/\n$/);
    }
    assert.equal((await get('/_emdash/api/auth/me')).headers.get('x-robots-tag'), 'noindex, nofollow');
  });

  it('caches public pages at the edge with the legacy browser policy', async () => {
    const home = await get('/');
    assert.equal(home.headers.get('cache-control'), 'max-age=14400');
    for (const path of ['/blog', '/blog/mailcheck-helped', '/rss.xml', '/sitemap.xml', '/blog.json']) {
      const response = await get(path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get('cache-control'), 'public, max-age=0, must-revalidate', path);
      // Internal cache directives are consumed by Cloudflare, never sent to clients.
      assert.equal(response.headers.get('cache-tag'), null, path);
      assert.equal(response.headers.get('cloudflare-cdn-cache-control'), null, path);
    }
    await get('/blog/mailcheck-helped');
    const second = await get('/blog/mailcheck-helped');
    assert.match(second.headers.get('cf-cache-status') ?? '', /HIT|STALE|UPDATING|REVALIDATED/);
  });

  it('never shares preview or editor responses, and hides preview tokens from third parties', async () => {
    const preview = await get('/blog/mailcheck-helped?_preview=invalid-token');
    assert.equal(preview.headers.get('cache-control'), 'private, no-store');
    assert.equal(preview.headers.get('referrer-policy'), 'no-referrer');
    assert.equal(preview.headers.get('x-robots-tag'), 'noindex, nofollow');
    const head = (await preview.text()).split('</head>')[0];
    assert.match(head, /<meta name="referrer" content="no-referrer"/);
    assert.match(head, /<meta name="robots" content="noindex"/);
    const editor = await get('/blog/mailcheck-helped', { headers: { cookie: 'emdash-edit-mode=1' } });
    // Either a shared public copy (HIT) or a private render — never a stored private one.
    if (editor.headers.get('cf-cache-status') !== 'HIT') {
      assert.equal(editor.headers.get('cache-control'), 'private, no-store');
    }
  });
  // Backend endpoints (/api, /l) are not probed here. They never opt into the
  // route cache and the adapter marks such responses
  // `Cloudflare-CDN-Cache-Control: no-store`.
});
