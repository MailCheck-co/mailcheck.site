import { mkdtemp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import { createDialect } from 'emdash/db/sqlite';
import { SchemaRegistry } from 'emdash';
import { readWranglerConfig } from './read-wrangler-config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const collections = ['posts', 'pages'];
const archivalFields = [
  'source_document',
  'source_sha256',
  'asset_sources',
  'legacy_published',
  'legacy_path'
];
const runtimeFields = [
  'markdown',
  'legacy_date',
  'source_path',
  'thumbnail_source',
  'legacy_metadata'
];
const remote = process.argv.includes('--remote');
const localBindings = process.argv.includes('--local-bindings');
const apply = process.argv.includes('--apply');
const localIndex = process.argv.indexOf('--database');

if ((!remote && !localBindings && localIndex < 0) || (remote && localBindings)) {
  throw new Error(
    'Choose --remote (staging only), --local-bindings or --database <disposable SQLite file>. Default is read-only plan.'
  );
}

let proxy;
let db;
try {
  if (remote) {
    const config = readWranglerConfig();
    if (
      config.account_id !== '2c9835fef0d4f0bacd0ffe1399957f42' ||
      config.name !== 'mailcheck-site' ||
      config.d1_databases?.[0]?.database_id !== '81355b8d-8d94-4c48-8e58-fab82b7c1323'
    ) {
      throw new Error('Unexpected staging database');
    }
    const directory = await mkdtemp('/tmp/opencode/mailcheck-cms-schema-');
    const configPath = resolve(directory, 'wrangler.jsonc');
    await writeFile(
      configPath,
      JSON.stringify({
        name: 'mailcheck-cms-schema-migration',
        account_id: config.account_id,
        compatibility_date: config.compatibility_date,
        d1_databases: config.d1_databases.map((binding) => ({ ...binding, remote: true }))
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

  const registry = new SchemaRegistry(db);
  const plan = [];
  for (const collection of collections) {
    for (const field of runtimeFields) {
      if (!(await registry.getField(collection, field))) {
        throw new Error(`Required runtime field is missing: ${collection}.${field}`);
      }
    }
    for (const field of archivalFields) {
      if (await registry.getField(collection, field)) plan.push({ collection, field });
    }
  }

  console.log(
    `${remote ? 'STAGING' : 'LOCAL'} ${apply ? 'APPLY' : 'PLAN'}: ${
      plan.length
    } archival fields scheduled for removal from ${collections.join(' and ')}.`
  );
  for (const item of plan) console.log(`- ${item.collection}.${item.field}`);

  if (apply) {
    for (const { collection, field } of plan) {
      await registry.deleteField(collection, field);
      console.log(`Removed ${collection}.${field}`);
    }
    console.log('Archival field cleanup complete. Runtime fields were retained.');
  }
} finally {
  await db?.destroy();
  await proxy?.dispose();
}
