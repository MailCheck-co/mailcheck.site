import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cmsDocument, publicPost, sortPosts, escapeXml } from '../src/server/cms-document.ts';
import { sanitizeMarkdown } from '../src/server/markdown-security.ts';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      !path.extname(specifier) &&
      context.parentURL
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const candidateTs = path.resolve(parentDir, `${specifier}.ts`);
      if (existsSync(candidateTs)) {
        return nextResolve(pathToFileURL(candidateTs).href, context);
      }
    }
    return nextResolve(specifier, context);
  }
});

const { blogPostingSchema, videoObjectSchema, webPageSchema } = await import(
  '../src/utils/json-ld.ts'
);

test('CMS projection preserves source image directory, editor fields and safe public JSON', () => {
  const document = cmsDocument(
    {
      slug: 'new-slug',
      title: 'New title',
      description: 'SEO',
      markdown: '# Hi',
      source_path: 'src/routes/blog/old-slug/index.md',
      legacy_metadata: { private: 'PRIVATE METADATA' },
      legacy_date: '15.06.2023',
      createdAt: new Date('2023-06-14T12:00:00Z'),
      updatedAt: new Date('2023-06-15T12:00:00Z'),
      publishedAt: new Date('2023-06-15T12:00:00Z'),
      noindex: 1
    },
    true
  );
  assert.equal(document.directory, '../routes/blog/old-slug');
  assert.equal(document.metadata.title, 'New title');
  assert.equal(document.metadata.noindex, 'true');
  assert.equal(document.createdAt, '2023-06-14T12:00:00.000Z');
  assert.equal(document.updatedAt, '2023-06-15T12:00:00.000Z');
  assert.equal(document.publishedAt, '2023-06-15T12:00:00.000Z');
  assert.equal(
    cmsDocument(
      { slug: 'x', title: 'x', markdown: 'x', noindex: true, seo: { noIndex: false } },
      false
    ).metadata.noindex,
    'false'
  );
  const post = publicPost(document);
  assert.equal(post.slug, 'new-slug');
  assert.equal(post.published, true);
  assert.equal(post.noindex, 'true');
  assert.equal(post.createdAt, '2023-06-14T12:00:00.000Z');
  assert.doesNotMatch(JSON.stringify(post), /PRIVATE METADATA|legacy_metadata|markdown/);
  assert.equal(cmsDocument({ slug: '../../etc', title: 'x', markdown: 'x' }, false), null);
  assert.equal(cmsDocument({ slug: 'x', title: '', markdown: 'x' }, false), null);
});

test('structured data keeps publication and modification dates distinct', () => {
  const post = blogPostingSchema({
    url: 'https://mailcheck.co/blog/example',
    title: 'Example',
    description: 'Description',
    date: '2025-10-06T00:00:00.000Z',
    dateModified: '2026-10-24T21:22:18.343Z'
  });
  assert.equal(post.datePublished, '2025-10-06');
  assert.equal(post.dateModified, '2026-10-24');

  const page = webPageSchema({
    url: 'https://mailcheck.co/example',
    name: 'Example',
    description: 'Description',
    datePublished: '2025-10-06',
    dateModified: '2026-10-24'
  });
  assert.equal(page.datePublished, '2025-10-06');
  assert.equal(page.dateModified, '2026-10-24');
});

test('video upload dates include a timezone-qualified time', () => {
  const video = videoObjectSchema({
    id: 'example',
    title: 'Example video',
    description: 'Description',
    date: '13 August 2021',
    pageUrl: 'https://mailcheck.co/videos'
  });
  assert.equal(video.uploadDate, '2021-08-13T00:00:00.000Z');

  const timestampVideo = videoObjectSchema({
    id: 'example-2',
    title: 'Example video 2',
    description: 'Description',
    date: '2025-10-06T12:34:56+02:00',
    pageUrl: 'https://mailcheck.co/videos'
  });
  assert.equal(timestampVideo.uploadDate, '2025-10-06T10:34:56.000Z');
});

test('new CMS documents support absolute uploaded media and dedicated SEO fields', () => {
  const document = cmsDocument(
    {
      slug: 'new-post',
      title: 'Title',
      description: 'Description',
      markdown: 'content',
      thumbnail_source: '/_emdash/api/media/file/new.webp',
      seo: {
        title: 'SEO title',
        description: 'SEO description',
        canonical: '/canonical',
        noIndex: true
      }
    },
    true
  );
  assert.equal(document.directory, '../routes/blog/new-post');
  assert.equal(document.metadata.thumbnailImg, '/_emdash/api/media/file/new.webp');
  assert.equal(document.metadata.title, 'SEO title');
  assert.equal(document.metadata.canonical, '/canonical');
  assert.equal(document.metadata.noindex, 'true');
});

test('blog sorting is chronological and RSS fields are XML-safe', () => {
  assert.deepEqual(
    sortPosts([
      { slug: 'old', date: '31.12.2019' },
      { slug: 'recent', date: '01.01.2020' }
    ]).map((p) => p.slug),
    ['recent', 'old']
  );
  assert.deepEqual(
    sortPosts([
      { slug: 'old', date: '2023-12-31' },
      { slug: 'recent', date: '2024-01-01' }
    ]).map((p) => p.slug),
    ['recent', 'old']
  );
  assert.equal(escapeXml('A & B < C "D"'), 'A &amp; B &lt; C &quot;D&quot;');
});

test('Markdown sanitization preserves FAQ/tables/anchors and blocks stored XSS', () => {
  const html = sanitizeMarkdown(
    '<details><summary>Question</summary><p id="answer">Answer</p></details><table class="services-table"><tr><td>x</td></tr></table><img src="/ok.webp" onerror="alert(1)"><a href="javascript:alert(1)">x</a><script>alert(1)</script><iframe src="https://evil.test"></iframe><style>body{display:none}</style>'
  );
  assert.match(html, /<details><summary>Question<\/summary>/);
  assert.match(html, /id="answer"/);
  assert.match(html, /class="services-table"/);
  assert.match(html, /src="\/ok.webp"/);
  assert.doesNotMatch(html, /onerror|javascript:|<script|<iframe|<style|display:none/);
});

test('media manifest maps original content-addressed bytes deterministically', async () => {
  const manifest = JSON.parse(
    await readFile(new URL('../src/data/cms-media-manifest.json', import.meta.url), 'utf8')
  );
  assert.equal(Object.keys(manifest.assets).length, 218);
  assert.ok(Object.keys(manifest.assets).every((key) => key.endsWith('|original')));
  assert.equal(new Set(Object.values(manifest.assets).map((asset) => asset.storageKey)).size, 216);
  const asset =
    manifest.assets[
      'src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg|original'
    ];
  assert.ok(asset);
  const bytes = await readFile(
    new URL(
      '../src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg',
      import.meta.url
    )
  );
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
  assert.equal(asset.url, `/_emdash/api/media/file/${asset.storageKey}`);
});
