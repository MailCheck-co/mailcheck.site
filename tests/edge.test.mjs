import assert from 'node:assert/strict';
import { test } from 'node:test';
import { finalizeResponse, legacyRedirect } from '../src/server/edge.ts';

const url = (path) => new URL(`https://mailcheck.co${path}`);

test('/index.html keeps the Firebase cleanUrls 301 to /', () => {
  const response = legacyRedirect(url('/index.html?utm_source=x'));
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), '/?utm_source=x');
  assert.equal(legacyRedirect(url('/blog')), null);
});

test('framework redirects and errors get the legacy security headers', () => {
  const redirect = finalizeResponse(new Response(null, { status: 301, headers: { Location: '/blog' } }),
    url('/blog/'), { MAILCHECK_INDEXABLE: 'true' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/blog');
  for (const [name, value] of [['x-content-type-options', 'nosniff'], ['x-frame-options', 'SAMEORIGIN'],
    ['referrer-policy', 'no-referrer-when-downgrade'], ['x-ua-compatible', 'ie=edge'], ['x-xss-protection', '1; mode=block']]) {
    assert.equal(redirect.headers.get(name), value);
  }
  assert.equal(redirect.headers.get('x-robots-tag'), null);
});

test('route-specific policies are not overwritten', () => {
  const preview = finalizeResponse(new Response('draft', { headers: { 'Referrer-Policy': 'no-referrer' } }),
    url('/blog/x?_preview=t'), { MAILCHECK_INDEXABLE: 'true' });
  assert.equal(preview.headers.get('referrer-policy'), 'no-referrer');
});

test('non-production deployments are never indexable, whatever the hostname', () => {
  for (const env of [undefined, {}, { MAILCHECK_INDEXABLE: 'false' }]) {
    const response = finalizeResponse(new Response('ok'), url('/'), env);
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  }
});

test('the CMS admin is noindex and keeps its own headers in production', () => {
  const response = finalizeResponse(new Response('{}', { status: 401 }), url('/_emdash/api/auth'), { MAILCHECK_INDEXABLE: 'true' });
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.equal(response.headers.get('x-frame-options'), null);
});

test('immutable upstream headers are handled', async () => {
  const upstream = await fetch('data:text/plain,ok').catch(() => null);
  if (!upstream) return;
  const response = finalizeResponse(upstream, url('/'), { MAILCHECK_INDEXABLE: 'true' });
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(await response.text(), 'ok');
});
