import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import sharp from 'sharp';

const base = process.env.CMS_MEDIA_TEST_URL;
test(
  'every migrated CMS media object is publicly readable with expected metadata',
  { skip: !base },
  async () => {
    const manifest = JSON.parse(
      await readFile(new URL('../src/data/cms-media-manifest.json', import.meta.url), 'utf8')
    );
    const objects = Object.values(manifest.assets);
    const originals = new Set(Object.values(manifest.assets).map((asset) => asset.storageKey));
    assert.equal(objects.length, 218);
    for (let offset = 0; offset < objects.length; offset += 5) {
      await Promise.all(
        objects.slice(offset, offset + 5).map(async (asset) => {
          const response = await fetch(new URL(asset.url, base), { method: 'HEAD' });
          assert.equal(response.status, 200, asset.filename);
          assert.equal(
            response.headers.get('content-type')?.split(';')[0],
            asset.mimeType,
            asset.filename
          );
          if (response.headers.has('content-length') && !response.headers.has('content-encoding')) {
            assert.equal(
              Number(response.headers.get('content-length')),
              asset.size,
              asset.filename
            );
          } else {
            // Cloudflare may compress SVG/text and remove HEAD Content-Length.
            // Compare decoded response bytes instead of assuming an R2 header.
            const downloaded = await fetch(new URL(asset.url, base));
            assert.equal(downloaded.status, 200, asset.filename);
            const bytes = Buffer.from(await downloaded.arrayBuffer());
            assert.equal(bytes.length, asset.size, asset.filename);
            assert.equal(
              createHash('sha256').update(bytes).digest('hex'),
              asset.sha256,
              asset.filename
            );
          }
          assert.match(
            response.headers.get('cache-control'),
            originals.has(asset.storageKey) ? /must-revalidate/ : /immutable/,
            asset.filename
          );
        })
      );
    }
  }
);

test(
  'content uses one original with server-side AVIF/WebP and responsive sizes',
  { skip: !base },
  async () => {
    const manifest = JSON.parse(
      await readFile(new URL('../src/data/cms-media-manifest.json', import.meta.url), 'utf8')
    );
    const original =
      manifest.assets[
        'src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg|original'
      ];
    const page = await (
      await fetch(new URL('/blog/10-abandoned-cart-hacks-that-rise-sales', base))
    ).text();
    assert.match(page, /<picture><source type="image\/avif"/);
    assert.ok(page.includes(`/media/image/${original.storageKey}`));
    for (const [format, width, height] of [
      ['avif', 880, 586],
      ['webp', 880, 586],
      ['avif', 440, 293]
    ]) {
      const response = await fetch(
        new URL(`/media/image/${original.storageKey}?w=${width}&f=${format}`, base)
      );
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('content-type'), `image/${format}`);
      const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata();
      assert.equal(metadata.width, width);
      assert.equal(metadata.height, height);
      const conditional = await fetch(
        new URL(`/media/image/${original.storageKey}?w=${width}&f=${format}`, base),
        {
          headers: { 'if-none-match': response.headers.get('etag') }
        }
      );
      assert.equal(conditional.status, 304);
    }
  }
);
