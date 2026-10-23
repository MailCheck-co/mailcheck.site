import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { validateSeed } from 'emdash/seed';
import { createCmsSeed, parseLegacyDocument } from '../scripts/prepare-cms-seed.mjs';

test('legacy frontmatter keeps colons, booleans, empty values and the original body', () => {
  const body = '# {title}\n\n<Video id={video} title={title} />\n';
  const { metadata, body: actual } = parseLegacyDocument(`---\ntitle: "A: B"\nnoindex: false\npublished: true\ncanonical:\n---\n${body}`, 'fixture');
  assert.deepEqual(metadata, { title: 'A: B', noindex: false, published: true, canonical: '' });
  assert.equal(actual, body);
  assert.throws(() => parseLegacyDocument('missing frontmatter', 'fixture'));
  assert.throws(() => parseLegacyDocument('---\ntitle: A\ntitle: B\n---\ntext', 'fixture'));
});

test('CMS seed contains all legacy Markdown as non-routable drafts without loss', async () => {
  const seed = await createCmsSeed();
  assert.equal(validateSeed(seed).valid, true);
  assert.equal(seed.content.legacy_posts.length, 50);
  assert.equal(seed.content.legacy_pages.length, 15);
  assert.ok(seed.collections.every((collection) => collection.routable === false));
  assert.deepEqual(seed.collections.map((collection) => collection.slug), ['legacy_posts', 'legacy_pages', 'tracking_targets']);
  assert.deepEqual(seed.content.tracking_targets, []);
  const entries = Object.values(seed.content).flat();
  assert.equal(new Set(entries.map((entry) => entry.data.legacy_path)).size, 65);
  for (const entry of entries) {
    assert.equal(entry.status, 'draft');
    const original = await readFile(new URL(`../${entry.data.source_path}`, import.meta.url), 'utf8');
    assert.equal(entry.data.source_document, original);
    assert.equal(entry.data.source_sha256, createHash('sha256').update(original).digest('hex'));
    assert.equal(entry.data.markdown, parseLegacyDocument(original, entry.data.source_path).body);
  }
  assert.equal(entries.find((entry) => entry.data.legacy_path === '/terms').data.canonical, '/');
  assert.equal(entries.find((entry) => entry.data.legacy_path === '/terms').data.noindex, true);
  assert.equal(seed.content.legacy_posts.filter((entry) => entry.data.legacy_published).length, 50);
  assert.equal(entries.find((entry) => entry.slug === 'make-com-integration').data.asset_sources.length, 33);
  const helpPost = entries.find((entry) => entry.slug === 'mailcheck-helped');
  assert.ok(helpPost.data.asset_sources.some((asset) => asset.missing && asset.reference.startsWith('./email-bounce-rate.jpg')));
});

test('checked-in seed is deterministic and current', async () => {
  const seed = await createCmsSeed();
  assert.equal(await readFile(new URL('../seed/seed.json', import.meta.url), 'utf8'), `${JSON.stringify(seed, null, 2)}\n`);
});
