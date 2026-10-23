import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getPlatformProxy } from 'wrangler';
import { D1Dialect } from 'kysely-d1';
import { Kysely } from 'kysely';
import { MediaRepository } from 'emdash';

// Remove ONLY migration-generated derivative catalogue rows. Do not delete R2
// objects: old published URLs and rollback deployments must remain readable.
const remote = process.argv.includes('--remote');
const apply = process.argv.includes('--apply');
const config = JSON.parse(await readFile('wrangler.jsonc', 'utf8'));
if (config.account_id !== '2c9835fef0d4f0bacd0ffe1399957f42' || config.name !== 'mailcheck-site' ||
    config.d1_databases?.length !== 1 || config.d1_databases[0].database_id !== '81355b8d-8d94-4c48-8e58-fab82b7c1323') {
  throw new Error('Unexpected staging database');
}
let configPath = resolve('wrangler.jsonc');
if (remote) {
  const directory = await mkdtemp('/tmp/opencode/mailcheck-media-catalog-');
  configPath = resolve(directory, 'wrangler.jsonc');
  await writeFile(configPath, JSON.stringify({ name: 'mailcheck-media-catalog', account_id: config.account_id,
    compatibility_date: config.compatibility_date, d1_databases: config.d1_databases.map(binding => ({ ...binding, remote: true })) }));
}
const proxy = await getPlatformProxy({ configPath, envFiles: [], remoteBindings: remote, ...(remote ? { persist: false } : {}) });
const db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });
try {
  const manifest = JSON.parse(await readFile('seed/media.json', 'utf8'));
  const originals = new Set(Object.entries(manifest.assets).filter(([key]) => key.endsWith('|original')).map(([,asset]) => asset.storageKey));
  const derivatives = new Map(Object.entries(manifest.compatibilityRenditions ?? manifest.assets).filter(([key,asset]) => key.endsWith('|880') && !originals.has(asset.storageKey)).map(([,asset]) => [asset.storageKey, asset]));
  const rows = await db.selectFrom('media').selectAll().execute();
  const plan = rows.filter(row => derivatives.has(row.storage_key));
  for (const row of plan) {
    const asset = derivatives.get(row.storage_key);
    if (row.content_hash !== asset.sha256 || row.filename !== asset.filename || row.size !== asset.size ||
        row.caption !== 'Imported legacy site asset' || row.alt || row.folder_id || row.author_id) {
      throw new Error(`Derivative was edited; review required: ${row.id}`);
    }
    // Don't silently break media-ID references introduced by an editor.
    const usage = await db.selectFrom('_emdash_media_usage').select('id').where('media_id', '=', row.id).executeTakeFirst();
    if (usage) throw new Error(`Derivative is referenced by content; review required: ${row.id}`);
    const avatar = await db.selectFrom('_emdash_bylines').select('id').where('avatar_media_id', '=', row.id).executeTakeFirst();
    if (avatar) throw new Error(`Derivative is used as avatar; review required: ${row.id}`);
  }
  for (const key of originals) if (!rows.some(row => row.storage_key === key && row.status === 'ready')) throw new Error(`Missing original: ${key}`);
  console.log(`${remote ? 'STAGING' : 'LOCAL'} ${apply ? 'APPLY' : 'PLAN'}: ${originals.size} original assets retained; ${plan.length} migration derivative catalogue rows removed. No R2 objects or content deleted.`);
  if (apply) {
    const directory = await mkdtemp('/tmp/opencode/mailcheck-media-catalog-backup-');
    await writeFile(resolve(directory, 'derivative-rows.json'), JSON.stringify(plan, null, 2), { mode: 0o600 });
    console.log(`Catalogue-row recovery snapshot: ${directory}/derivative-rows.json`);
    const repo = new MediaRepository(db);
    for (const row of plan) {
      // Predicate-guard the exact migration metadata against concurrent edits.
      const deleted = await db.deleteFrom('media').where('id', '=', row.id).where('storage_key', '=', row.storage_key)
        .where('content_hash', '=', row.content_hash).where('filename', '=', row.filename)
        .where('caption', '=', row.caption).where('alt', 'is', null).where('folder_id', 'is', null).where('author_id', 'is', null)
        .executeTakeFirst();
      if (Number(deleted.numDeletedRows) !== 1) throw new Error(`Derivative changed during cleanup: ${row.id}`);
    }
    const after = await repo.count();
    console.log(`Media catalogue now contains ${after} items (${originals.size} imported originals; unrelated uploads retained).`);
  }
} finally {
  await db.destroy();
  await proxy.dispose();
}
