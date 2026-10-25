import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import sharp from 'sharp';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';
import { legacyImages } from '../configs/legacy-images.mjs';
import { imageSources } from '../src/lib/ResponsiveImage/sources.mjs';

const path = fileURLToPath(
  new URL(
    '../src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg',
    import.meta.url
  )
);

test('legacy images opt in explicitly without intercepting Astro or URL imports', async () => {
  const plugin = legacyImages();
  for (const suffix of ['', '?url', '?raw', '?width=880', '?legacy-width=invalid']) {
    assert.equal(await plugin.load(`${path}${suffix}`), null);
  }
});

test('build emits the original requested 880px width even for a smaller source', async () => {
  const plugin = legacyImages();
  let asset;
  const result = await plugin.load.call(
    {
      addWatchFile(file) {
        assert.equal(file, path);
      },
      emitFile(value) {
        asset = value;
        return 'test-image';
      }
    },
    `${path}?legacy-width=880`
  );
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

test('responsive image sources preserve descriptors and select the original fallback', () => {
  const sources = imageSources(
    'https://cdn.test/photo.webp 500w, https://cdn.test/photo.png 500w, https://cdn.test/photo.avif 500w',
    '/assets/photo.png'
  );
  assert.equal(sources.avif, 'https://cdn.test/photo.avif 500w');
  assert.equal(sources.webp, 'https://cdn.test/photo.webp 500w');
  assert.equal(sources.src, '/assets/photo.png');
  assert.equal(sources.srcset, 'https://cdn.test/photo.png 500w');
});

test('responsive image sources handle data URLs without splitting their comma', () => {
  const sources = imageSources(
    'data:image/webp;base64,webp 2x, data:image/png;base64,png 2x, data:image/avif;base64,avif 2x',
    'data:image/png;base64,original'
  );
  assert.equal(sources.webp, 'data:image/webp;base64,webp 2x');
  assert.equal(sources.avif, 'data:image/avif;base64,avif 2x');
  assert.equal(sources.src, 'data:image/png;base64,original');
  assert.equal(sources.srcset, 'data:image/png;base64,png 2x');
});

test('responsive image sources preserve multiple widths and URL query/hash/comma characters', () => {
  const sources = imageSources(
    '/photo,name.AVIF?v=2#image 320w, /photo.avif?v=3 640w, /photo.webp?size=320 1x, /photo.webp?size=640 2x, /photo.jpeg 640w',
    '/original.jpg'
  );
  assert.equal(sources.avif, '/photo,name.AVIF?v=2#image 320w, /photo.avif?v=3 640w');
  assert.equal(sources.webp, '/photo.webp?size=320 1x, /photo.webp?size=640 2x');
  assert.equal(sources.srcset, '/photo.jpeg 640w');
});

test('JPEG originals stay JPEG even when the legacy import also includes PNG', () => {
  const sources = imageSources(
    '/photo.webp 500w, /photo.png 500w, /photo.avif 500w',
    '/original.jpg'
  );
  assert.equal(sources.src, '/original.jpg');
  assert.equal(sources.srcset, undefined);
});

test('missing or malformed candidates never stringify objects or emit invalid descriptors', () => {
  assert.equal(imageSources({}, '/original.png').srcset, undefined);
  assert.equal(imageSources('/bad.avif not-a-descriptor, /bad.png 12q', '/original.png').avif, '');
  assert.equal(imageSources('', '/original.jpg').src, '/original.jpg');
});

test('local mixed-format imports keep the comma-separated default string in build and development', async () => {
  const localPath = fileURLToPath(
    new URL('../src/lib/Reviews/logo-beta-list.png', import.meta.url)
  );
  for (const command of ['build', 'serve']) {
    const plugin = legacyImages();
    plugin.configResolved({ command });
    const assets = [];
    const result = await plugin.load.call(
      {
        addWatchFile() {},
        emitFile(asset) {
          assets.push(asset);
          return `image${assets.length}`;
        }
      },
      `${localPath}?w=120&format=webp;png;avif&srcset`
    );
    const { default: srcset } = await import(`data:text/javascript,${encodeURIComponent(result)}`);
    assert.equal(typeof srcset, 'string');
    assert.equal(srcset.split(', ').length, 3);
    assert.ok(srcset.split(', ').every((candidate) => candidate.endsWith(' 120w')));
    if (command === 'serve') {
      const sources = imageSources(srcset, '/original.png');
      assert.match(sources.avif, /^data:image\/avif;base64,.+ 120w$/);
      assert.match(sources.webp, /^data:image\/webp;base64,.+ 120w$/);
      assert.match(sources.srcset, /^data:image\/png;base64,.+ 120w$/);
    } else {
      assert.deepEqual(
        assets.map(({ name }) => name),
        ['logo-beta-list.webp', 'logo-beta-list.png', 'logo-beta-list.avif']
      );
    }
  }
});

test('responsive image renders ordered MIME sources and forwards img attributes during SSR', async () => {
  const source = await readFile(
    new URL('../src/lib/ResponsiveImage/index.svelte', import.meta.url),
    'utf8'
  );
  const compiled = compile(source, { generate: 'server' });
  const module = compiled.js.code
    .replace(
      './sources.mjs',
      new URL('../src/lib/ResponsiveImage/sources.mjs', import.meta.url).href
    )
    .replace('svelte/internal/server', import.meta.resolve('svelte/internal/server'));
  const { default: Image } = await import(`data:text/javascript,${encodeURIComponent(module)}`);
  const { body } = render(Image, {
    props: {
      src: '/original.jpg',
      srcset: '/photo.webp 500w, /photo.png 500w, /photo.avif 500w',
      alt: 'Invite friends',
      width: 500,
      height: 333,
      class: 'affiliate-image',
      loading: 'lazy',
      decoding: 'async',
      sizes: '(max-width: 500px) 100vw, 500px',
      'data-image': 'affiliate'
    }
  });
  assert.ok(body.indexOf('image/avif') < body.indexOf('image/webp'));
  assert.ok(body.indexOf('image/webp') < body.indexOf('<img'));
  assert.match(body, /<source[^>]*type="image\/avif"[^>]*srcset="\/photo.avif 500w"/);
  assert.match(body, /<source[^>]*type="image\/webp"[^>]*srcset="\/photo.webp 500w"/);
  const image = body.match(/<img[^>]*>/)[0];
  for (const attribute of [
    'src="/original.jpg"',
    'width="500"',
    'height="333"',
    'class="affiliate-image"',
    'loading="lazy"',
    'decoding="async"',
    'data-image="affiliate"'
  ]) {
    assert.ok(image.includes(attribute), attribute);
  }
  assert.doesNotMatch(image, /srcset=|\[object Object\]/);
  assert.equal((body.match(/sizes=/g) || []).length, 3);
});
