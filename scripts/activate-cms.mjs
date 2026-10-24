import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { createDialect } from 'emdash/db/sqlite';
import {
  ContentRepository,
  OptionsRepository,
  SchemaRegistry,
  handleContentGet,
  handleContentPublish,
  handleMediaCreate
} from 'emdash';
import { readWranglerConfig } from './read-wrangler-config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = (value) => createHash('sha256').update(value).digest('hex');
const runFile = promisify(execFile);
const seed = JSON.parse(await readFile(resolve(root, 'seed/seed.json'), 'utf8'));
const manifest = JSON.parse(await readFile(resolve(root, 'seed/media.json'), 'utf8'));
const remote = process.argv.includes('--remote');
const localBindings = process.argv.includes('--local-bindings');
const apply = process.argv.includes('--apply');
const localIndex = process.argv.indexOf('--database');
if ((!remote && !localBindings && localIndex < 0) || (remote && localBindings))
  throw new Error(
    'Choose --remote (staging only), --local-bindings or --database <disposable SQLite file>. Default is read-only plan.'
  );

let proxy;
let db;
try {
  if (remote) {
    const config = readWranglerConfig();
    if (
      config.account_id !== '2c9835fef0d4f0bacd0ffe1399957f42' ||
      config.name !== 'mailcheck-site' ||
      config.d1_databases?.[0]?.database_id !== '81355b8d-8d94-4c48-8e58-fab82b7c1323' ||
      config.r2_buckets?.[0]?.bucket_name !== 'mailcheck-media'
    )
      throw new Error('Unexpected staging resources');
    const directory = await mkdtemp('/tmp/opencode/mailcheck-cms-proxy-');
    const configPath = resolve(directory, 'wrangler.jsonc');
    // No Worker routes or production DNS changes; this only opens bindings via
    // the operator's existing Wrangler authentication. No secret values read.
    await writeFile(
      configPath,
      JSON.stringify({
        name: 'mailcheck-cms-migration',
        account_id: config.account_id,
        compatibility_date: config.compatibility_date,
        d1_databases: config.d1_databases.map((binding) => ({ ...binding, remote: true })),
        r2_buckets: config.r2_buckets.map((binding) => ({ ...binding, remote: true }))
      })
    );
    proxy = await getPlatformProxy({
      configPath,
      envFiles: [],
      persist: false,
      remoteBindings: true
    });
    db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });
  } else if (localBindings) {
    proxy = await getPlatformProxy({
      configPath: resolve(root, 'wrangler.jsonc'),
      envFiles: [],
      remoteBindings: false
    });
    db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });
  } else {
    db = new Kysely({ dialect: createDialect({ url: resolve(process.argv[localIndex + 1]) }) });
  }
  const repo = new ContentRepository(db);
  const options = new OptionsRepository(db);
  const activated = await options.get('mailcheck:cms_bootstrap_complete');
  const plan = [];
  // Check every entry before making any write. Never publish an editor's
  // pending revision or overwrite edits with the bootstrap snapshot.
  for (const [collection, entries] of Object.entries(seed.content)) {
    for (const expected of entries) {
      const item = await repo.findBySlug(collection, expected.slug, 'en');
      if (!item) throw new Error(`Missing ${collection}/${expected.slug}`);
      if (item.status === 'published') continue;
      if (activated)
        throw new Error(
          `Bootstrap already completed; do not republish editorially unpublished entry: ${expected.slug}`
        );
      if (item.status !== 'draft' || item.draftRevisionId)
        throw new Error(`Review required: ${collection}/${expected.slug} has editorial changes`);
      for (const [key, value] of Object.entries(expected.data)) {
        const actual = item.data[key];
        const equal =
          typeof value === 'boolean'
            ? Number(actual) === Number(value)
            : JSON.stringify(actual) === JSON.stringify(value);
        if (!equal)
          throw new Error(
            `Review required: ${collection}/${expected.slug} field ${key} differs from the import`
          );
      }
      plan.push({ collection, item, expected });
    }
  }
  const objects = [
    ...new Map(Object.values(manifest.assets).map((asset) => [asset.storageKey, asset])).values()
  ];
  for (const asset of objects) {
    const bytes = await readFile(
      resolve(root, '.emdash/migration-media', asset.storageKey.slice('legacy/'.length))
    );
    if (hash(bytes) !== asset.sha256) throw new Error(`Media checksum mismatch: ${asset.filename}`);
  }
  console.log(
    `${remote ? 'STAGING' : 'LOCAL'} ${apply ? 'APPLY' : 'PLAN'}: ${
      plan.length
    } untouched imported drafts to publish; ${
      objects.length
    } media objects to register. No owner/account changes.`
  );
  if (!apply) process.exitCode = 0;
  else {
    for (let offset = 0; offset < objects.length; offset += 5) {
      const results = await Promise.allSettled(
        objects.slice(offset, offset + 5).map(async (asset) => {
          const existing = await db
            .selectFrom('media')
            .select(['id', 'content_hash'])
            .where('storage_key', '=', asset.storageKey)
            .executeTakeFirst();
          if (existing && existing.content_hash !== asset.sha256)
            throw new Error(`Media conflict: ${asset.filename}`);
          if (proxy) {
            const stored = await proxy.env.MEDIA.head(asset.storageKey);
            const file = resolve(
              root,
              '.emdash/migration-media',
              asset.storageKey.slice('legacy/'.length)
            );
            const bytes = await readFile(file);
            const md5 = createHash('md5').update(bytes).digest('hex');
            if (
              stored &&
              (stored.size !== asset.size ||
                (stored.customMetadata?.sha256 !== asset.sha256 && stored.etag !== md5))
            )
              throw new Error(`R2 object conflict: ${asset.filename}`);
            if (!stored) {
              if (remote && asset.size > 4_000_000) {
                // Large bodies exceed the dev-proxy transport's reliable size;
                // Wrangler uploads directly to the same fixed staging bucket.
                const cli = resolve(root, 'node_modules/wrangler/bin/wrangler.js');
                await runFile(
                  process.execPath,
                  [
                    cli,
                    'r2',
                    'object',
                    'put',
                    `mailcheck-media/${asset.storageKey}`,
                    '--remote',
                    '--file',
                    file,
                    '--content-type',
                    asset.mimeType,
                    '--cache-control',
                    'public, max-age=31536000, immutable'
                  ],
                  { cwd: root, timeout: 120000 }
                );
              } else {
                await proxy.env.MEDIA.put(asset.storageKey, bytes, {
                  httpMetadata: {
                    contentType: asset.mimeType,
                    cacheControl: 'public, max-age=31536000, immutable'
                  },
                  customMetadata: { sha256: asset.sha256 }
                });
              }
              const verified = await proxy.env.MEDIA.head(asset.storageKey);
              if (!verified || verified.size !== asset.size || verified.etag !== md5)
                throw new Error(`Uploaded object verification failed: ${asset.filename}`);
            }
          }
          // Renditions are delivery/cache artifacts, never editorial assets.
          const isOriginal = Object.entries(manifest.assets).some(
            ([key, value]) => key.endsWith('|original') && value.storageKey === asset.storageKey
          );
          if (!existing && isOriginal) {
            const result = await handleMediaCreate(db, {
              ...asset,
              contentHash: asset.sha256,
              caption: 'Imported legacy site asset'
            });
            if (!result.success)
              throw new Error(
                `Media registration failed: ${asset.filename}: ${result.error.message}`
              );
          }
        })
      );
      // Settle in-flight writes before disposal, even when one upload fails.
      const failed = results.find((result) => result.status === 'rejected');
      if (failed) throw failed.reason;
      console.log(`Media checked: ${Math.min(offset + 5, objects.length)}/${objects.length}`);
    }
    const registry = new SchemaRegistry(db);
    // The canonical posts/pages collections become public Blog posts/Pages.
    for (const collection of seed.collections.filter(
      ({ slug }) => slug === 'posts' || slug === 'pages'
    )) {
      const post = collection.slug === 'posts';
      await registry.updateCollection(collection.slug, {
        label: post ? 'Blog posts' : 'Pages',
        labelSingular: post ? 'Blog post' : 'Page',
        description:
          'Public content. Edit Markdown, preview, then publish. Original source fields are migration backups, not editable content.',
        routable: true,
        urlPattern: post ? '/blog/{slug}' : '/{slug}',
        hasSeo: true,
        supports: ['drafts', 'revisions', 'preview', 'seo'],
        admin: { quickCreate: false }
      });
      await registry.updateField(collection.slug, 'markdown', {
        label: 'Article Markdown (HTML and legacy Video supported)',
        options: { rows: 24 }
      });
      await registry.updateField(collection.slug, 'thumbnail_source', {
        label: 'Thumbnail URL or original relative reference'
      });
      await registry.updateField(collection.slug, 'asset_sources', {
        label: 'Original asset references (migration backup)'
      });
      // Archive fields have NOT NULL constraints. Relaxing them requires a
      // separate table/schema migration; this switch enables existing-entry
      // editing, not an untested new-entry workflow.
    }
    for (const { collection, item, expected } of plan) {
      const current = await handleContentGet(db, collection, item.id, 'en');
      if (
        !current.success ||
        current.data.item.version !== item.version ||
        current.data.item.updatedAt !== item.updatedAt
      )
        throw new Error(`Entry changed during migration: ${expected.slug}`);
      const [day, month, year] = String(expected.data.legacy_date).split('.');
      const parsed = Date.parse(`${year}-${month}-${day}T00:00:00.000Z`);
      const result = await handleContentPublish(db, collection, item.id, {
        _rev: current.data._rev,
        ...(Number.isNaN(parsed) ? {} : { publishedAt: new Date(parsed).toISOString() })
      });
      if (!result.success)
        throw new Error(`Publish failed: ${expected.slug}: ${result.error.message}`);
      console.log(`Published ${collection}/${expected.slug}`);
    }
    await options.setIfAbsent('mailcheck:cms_bootstrap_complete', true);
    console.log(
      'Activation complete. Enable MAILCHECK_CONTENT_SOURCE=cms only after validation. Future reruns refuse to republish unpublished content.'
    );
  }
} finally {
  await db?.destroy();
  await proxy?.dispose();
}
