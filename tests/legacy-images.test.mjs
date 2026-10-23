import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import sharp from 'sharp';
import { legacyImages } from '../configs/legacy-images.mjs';

const path = fileURLToPath(new URL('../src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg', import.meta.url));

test('legacy images opt in explicitly without intercepting Astro or URL imports', async () => {
  const plugin = legacyImages();
  for (const suffix of ['', '?url', '?raw', '?width=880', '?legacy-width=invalid']) {
    assert.equal(await plugin.load(`${path}${suffix}`), null);
  }
});

test('build emits the original requested 880px width even for a smaller source', async () => {
  const plugin = legacyImages();
  let asset;
  const result = await plugin.load.call({
    addWatchFile(file) { assert.equal(file, path); },
    emitFile(value) { asset = value; return 'test-image'; }
  }, `${path}?legacy-width=880`);
  assert.equal(result, 'export default "__VITE_ASSET__test-image__";');
  assert.equal(asset.type, 'asset');
  assert.equal(asset.name, 'abandoned-cart-hacks.webp');
  const metadata = await sharp(asset.source).metadata();
  assert.equal(metadata.width, 880);
  assert.equal(metadata.height, 586);
  assert.equal(metadata.format, 'webp');
});

test('development exports a usable image URL without build-only emitFile', async () => {
  const plugin = legacyImages();
  plugin.configResolved({ command: 'serve' });
  const result = await plugin.load.call({ addWatchFile() {} }, `${path}?legacy-width=880`);
  assert.match(result, /^export default "data:image\/webp;base64,/);
});
