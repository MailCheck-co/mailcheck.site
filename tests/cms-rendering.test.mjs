import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import sharp from 'sharp';
import { cmsDocument, publicPost, sortPosts, escapeXml } from '../src/server/cms-document.ts';
import { sanitizeMarkdown } from '../src/server/markdown-security.ts';

test('CMS projection preserves source image directory, editor fields and safe public JSON', () => {
  const document = cmsDocument({ slug: 'new-slug', title: 'New title', description: 'SEO', markdown: '# Hi',
    source_path: 'src/routes/blog/old-slug/index.md', source_document: 'PRIVATE BACKUP', legacy_metadata: { title: 'Old title' },
    legacy_date: '15.06.2023', noindex: 1 }, true);
  assert.equal(document.directory, '../routes/blog/old-slug');
  assert.equal(document.metadata.title, 'New title');
  assert.equal(document.metadata.noindex, 'true');
  assert.equal(cmsDocument({ slug: 'x', title: 'x', markdown: 'x', noindex: true, seo: { noIndex: false } }, false).metadata.noindex, 'false');
  const post = publicPost(document);
  assert.equal(post.slug, 'new-slug');
  assert.equal(post.published, true);
  assert.doesNotMatch(JSON.stringify(post), /PRIVATE BACKUP|source_document|legacy_metadata|markdown/);
  assert.equal(cmsDocument({ slug: '../../etc', title: 'x', markdown: 'x' }, false), null);
  assert.equal(cmsDocument({ slug: 'x', title: '', markdown: 'x' }, false), null);
});

test('new CMS documents support absolute uploaded media and dedicated SEO fields', () => {
  const document = cmsDocument({ slug: 'new-post', title: 'Title', description: 'Description', markdown: 'content',
    thumbnail_source: '/_emdash/api/media/file/new.webp',
    seo: { title: 'SEO title', description: 'SEO description', canonical: '/canonical', noIndex: true } }, true);
  assert.equal(document.directory, '../routes/blog/new-post');
  assert.equal(document.metadata.thumbnailImg, '/_emdash/api/media/file/new.webp');
  assert.equal(document.metadata.title, 'SEO title');
  assert.equal(document.metadata.canonical, '/canonical');
  assert.equal(document.metadata.noindex, 'true');
});

test('blog sorting is chronological and RSS fields are XML-safe', () => {
  assert.deepEqual(sortPosts([{slug:'old',date:'31.12.2019'}, {slug:'recent',date:'01.01.2020'}]).map(p=>p.slug), ['recent','old']);
  assert.deepEqual(sortPosts([{slug:'old',date:'2023-12-31'}, {slug:'recent',date:'2024-01-01'}]).map(p=>p.slug), ['recent','old']);
  assert.equal(escapeXml('A & B < C "D"'), 'A &amp; B &lt; C &quot;D&quot;');
});

test('Markdown sanitization preserves FAQ/tables/anchors and blocks stored XSS', () => {
  const html = sanitizeMarkdown('<details><summary>Question</summary><p id="answer">Answer</p></details><table class="services-table"><tr><td>x</td></tr></table><img src="/ok.webp" onerror="alert(1)"><a href="javascript:alert(1)">x</a><script>alert(1)</script><iframe src="https://evil.test"></iframe><style>body{display:none}</style>');
  assert.match(html, /<details><summary>Question<\/summary>/);
  assert.match(html, /id="answer"/);
  assert.match(html, /class="services-table"/);
  assert.match(html, /src="\/ok.webp"/);
  assert.doesNotMatch(html, /onerror|javascript:|<script|<iframe|<style|display:none/);
});

test('media manifest maps original and 880px content-addressed bytes deterministically', async () => {
  const manifest = JSON.parse(await readFile(new URL('../seed/media.json', import.meta.url), 'utf8'));
  assert.equal(Object.keys(manifest.assets).length, 218);
  assert.ok(Object.keys(manifest.assets).every(key => key.endsWith('|original')));
  assert.equal(new Set(Object.values(manifest.assets).map(asset => asset.storageKey)).size, 216);
  const asset = manifest.compatibilityRenditions['src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg|880'];
  assert.ok(asset);
  assert.equal(asset.width, 880);
  assert.equal(asset.height, 586);
  const bytes = await sharp(new URL('../src/routes/blog/10-abandoned-cart-hacks-that-rise-sales/abandoned-cart-hacks.jpg', import.meta.url).pathname)
    .resize({ width: 880 }).webp().toBuffer();
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.sha256);
  assert.equal(asset.url, `/_emdash/api/media/file/${asset.storageKey}`);
});
