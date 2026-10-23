import assert from 'node:assert/strict';
import { test } from 'node:test';
import { imageOptions, imageUrl, serveImage } from '../src/server/media-images.ts';

const key = `legacy/${'a'.repeat(64)}.jpg`;
const stream = () => new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array([1, 2, 3])); controller.close(); } });
const bucket = (meta, counters = {}) => ({
  async head() { counters.heads = (counters.heads ?? 0) + 1; const m = meta(); return m && { size: 1024, ...m }; },
  async get() { counters.reads = (counters.reads ?? 0) + 1; const m = meta(); return m && { size: 1024, ...m, body: stream() }; }
});
const cache = () => {
  const data = new Map();
  return { async match(key) { return data.get(key)?.clone(); }, async put(key, response) { data.set(key, response.clone()); } };
};
test('image transforms only accept local media keys, bounded sizes and formats', () => {
  assert.equal(imageUrl(key), `/media/image/${key}?w=880&f=webp`);
  for (const path of ['../secret', 'legacy/private/key', 'https://evil.test/img.jpg', `${key}/extra`, `legacy/${'a'.repeat(64)}.svg`]) {
    assert.equal(imageOptions(path, new URLSearchParams('w=880&f=avif')), null);
  }
  for (const query of ['w=99999', 'w=881', 'w=880&f=svg', 'w=880&f=constructor', 'w=880&href=https://evil.test']) {
    assert.equal(imageOptions(key, new URLSearchParams(query)), null);
  }
  assert.deepEqual(imageOptions(key, new URLSearchParams('w=880&f=avif')), { width: 880, format: 'avif', immutable: true });
});

test('AVIF and WebP are encoded server-side and cached separately', async () => {
  const counters = {};
  const formats = [];
  const bindings = {
    MEDIA: bucket(() => ({ etag: 'source-hash', httpMetadata: { contentType: 'image/jpeg' } }), counters),
    IMAGES: { input() { return { transform(options) { assert.equal(options.width, 880); return { async output(options) {
      formats.push(options.format); return { response() { return new Response('encoded'); } };
    } }; } }; } }
  };
  const storage = cache();
  const request = (format, headers) => new Request(`https://example.test${imageUrl(key, 880, format)}`, { headers });
  const avif = await serveImage(request('avif'), key, bindings, storage);
  assert.equal(avif.headers.get('content-type'), 'image/avif');
  assert.match(avif.headers.get('cache-control'), /must-revalidate/);
  await serveImage(request('avif'), key, bindings, storage);
  // Second request is served from the transform cache: metadata only, no body read.
  assert.deepEqual(counters, { heads: 2, reads: 1 });
  const webp = await serveImage(request('webp'), key, bindings, storage);
  assert.equal(webp.headers.get('content-type'), 'image/webp');
  assert.deepEqual(formats, ['image/avif', 'image/webp']);
  assert.equal((await serveImage(request('avif', { 'if-none-match': avif.headers.get('etag') }), key, bindings, storage)).status, 304);
  assert.equal(counters.reads, 2, 'conditional revalidation must not read the original');
  assert.equal((await serveImage(request('avif', { 'if-none-match': `W/${avif.headers.get('etag')}, "other"` }), key, bindings, storage)).status, 304);
});

test('oversized originals are refused before reading or transforming them', async () => {
  const counters = {};
  const bindings = {
    MEDIA: bucket(() => ({ size: 26 * 1024 * 1024, etag: 'huge', httpMetadata: { contentType: 'image/jpeg' } }), counters),
    IMAGES: { input() { throw new Error('must not transform'); } }
  };
  const response = await serveImage(new Request(`https://example.test${imageUrl(key)}`), key, bindings, cache());
  assert.equal(response.status, 413);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(counters.reads, undefined);
});

test('replaceable upload keys revalidate R2 versions and never cache errors', async () => {
  const storage = cache();
  let version = 'one', transforms = 0;
  const upload = '01NEWUPLOAD.jpg';
  const bindings = {
    MEDIA: bucket(() => ({ etag: version, httpMetadata: { contentType: 'image/jpeg' } })),
    IMAGES: { input() { return { transform() { return { async output() { transforms++; return { response() { return new Response(version); } }; } }; } }; } }
  };
  const request = new Request(`https://example.test${imageUrl(upload)}`);
  assert.equal((await serveImage(request, upload, bindings, storage)).headers.get('cache-control'), 'public, max-age=0, must-revalidate');
  await serveImage(request, upload, bindings, storage);
  assert.equal(transforms, 1);
  version = 'two';
  assert.equal(await (await serveImage(request, upload, bindings, storage)).text(), 'two');
  assert.equal(transforms, 2);
  const missing = await serveImage(request, upload, { ...bindings, MEDIA: bucket(() => null) }, storage);
  assert.equal(missing.status, 404);
  assert.equal(missing.headers.get('cache-control'), 'no-store');
});
