// Creates the CMS `tracking_targets` collection in an existing EmDash database
// and imports entries (from a Cloudflare DNS zone export or a JSON file).
// Read-only plan by default; `--apply` writes. Never overwrites an existing
// entry: differences are reported for an editor to resolve in the admin.
//
//   node scripts/tracking-targets.mjs --remote \
//     --zone-file mailcheck.co.txt [--short-link-domain l.mailcheck.co] [--apply]
//   node scripts/tracking-targets.mjs --remote --json targets.json [--apply]
//     JSON: [{ "kind": "short_link", "key": "*", "url": "https://..." , "title"?, "note"? }]
//
// The import writes straight to D1, bypassing CMS hooks. Run it before the
// deploy that ships the TrackingTargets entrypoint, or redeploy afterwards
// (each Worker version has its own cache) so the table is not stale for up to 1 h.
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  TRACKING_KEY_PATTERN,
  TRACKING_KINDS,
  TRACKING_TARGETS_COLLECTION,
  TRACKING_URL_PATTERN,
  trackingTargetSlug,
  trackingTargetsCollection
} from '../configs/tracking-targets-collection.mjs';
import { readWranglerConfig } from './read-wrangler-config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const keyRe = new RegExp(TRACKING_KEY_PATTERN);
const urlRe = new RegExp(TRACKING_URL_PATTERN);

/** Minimal BIND zone parser for TXT records (Cloudflare "Export" format). */
export function parseZoneTxtRecords(zoneText) {
  const records = new Map();
  let origin = '';
  for (const rawLine of zoneText.split(/\r?\n/)) {
    const line = rawLine.replace(/;(?=(?:[^"]*"[^"]*")*[^"]*$).*$/, '').trim();
    if (!line) continue;
    const originMatch = line.match(/^\$ORIGIN\s+(\S+)/i);
    if (originMatch) {
      origin = originMatch[1].replace(/\.$/, '').toLowerCase();
      continue;
    }
    const match = line.match(/^(\S+)\s+(?:\d+\s+)?(?:IN\s+)?(?:\d+\s+)?TXT\s+(.+)$/i);
    if (!match) continue;
    let name = match[1].toLowerCase();
    name = name.endsWith('.') ? name.slice(0, -1) : name === '@' ? origin : origin ? `${name}.${origin}` : name;
    const strings = [...match[2].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1].replace(/\\(.)/g, '$1'));
    if (strings.length === 0) continue;
    // Firebase joined every string of every TXT record of the name.
    records.set(name, `${records.get(name) ?? ''}${strings.join('')}`);
  }
  return records;
}

/** Entries for TXT names directly under a domain: `<key>.<domain>`. */
export function targetsFromZone(records, domains) {
  const entries = [];
  for (const [kind, domain] of Object.entries(domains)) {
    if (kind !== 'short_link') continue;
    if (!domain) continue;
    const suffix = `.${domain.toLowerCase().replace(/\.$/, '')}`;
    for (const [name, value] of records) {
      if (!name.endsWith(suffix)) continue;
      const key = name.slice(0, -suffix.length);
      entries.push({ kind, key, url: value.trim(), title: `${kind} ${key === '*' ? '(default)' : key}`, note: `Imported from DNS TXT ${name}` });
    }
  }
  return entries;
}

export function validateTargets(entries) {
  const errors = [];
  const seen = new Set();
  const valid = [];
  for (const entry of entries) {
    const key = String(entry.key ?? '').trim().toLowerCase();
    const url = String(entry.url ?? '').trim();
    const id = `${entry.kind}:${key}`;
    if (!TRACKING_KINDS.includes(entry.kind)) errors.push(`${id}: unknown kind`);
    else if (!keyRe.test(key)) errors.push(`${id}: invalid key`);
    else if (!urlRe.test(url) || !/^https?:$/.test(safeProtocol(url))) errors.push(`${id}: invalid URL`);
    else if (seen.has(id)) errors.push(`${id}: duplicate`);
    else {
      seen.add(id);
      valid.push({ ...entry, key, url, title: String(entry.title || `${entry.kind} ${key}`), note: String(entry.note ?? '') });
    }
  }
  return { valid, errors };
}

function safeProtocol(url) {
  try {
    return new URL(url).protocol;
  } catch {
    return '';
  }
}

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function loadEntries() {
  const json = argValue('--json');
  const zone = argValue('--zone-file');
  if (json && zone) throw new Error('Use either --json or --zone-file');
  if (json) return JSON.parse(await readFile(resolve(json), 'utf8'));
  if (zone) {
    const domains = { short_link: argValue('--short-link-domain') ?? 'l.mailcheck.co' };
    return targetsFromZone(parseZoneTxtRecords(await readFile(resolve(zone), 'utf8')), domains);
  }
  return [];
}

async function main() {
  const remote = process.argv.includes('--remote');
  const localBindings = process.argv.includes('--local-bindings');
  const databaseFile = argValue('--database');
  const apply = process.argv.includes('--apply');
  if ([remote, localBindings, Boolean(databaseFile)].filter(Boolean).length !== 1) {
    throw new Error('Choose one of --remote, --local-bindings or --database <SQLite file>. Default is a read-only plan.');
  }
  const { valid, errors } = validateTargets(await loadEntries());
  for (const error of errors) console.error(`SKIP ${error}`);
  if (errors.length > 0 && apply) throw new Error('Fix the invalid entries above before --apply');

  const { getPlatformProxy } = await import('wrangler');
  const { Kysely } = await import('kysely');
  const { D1Dialect } = await import('kysely-d1');
  const { createDialect } = await import('emdash/db/sqlite');
  const { ContentRepository, SchemaRegistry, handleContentCreate, handleContentGet, handleContentPublish } = await import('emdash');

  let proxy;
  let db;
  try {
    if (remote) {
      const config = readWranglerConfig();
      if (config.account_id !== '2c9835fef0d4f0bacd0ffe1399957f42' || config.name !== 'mailcheck-site' ||
          config.d1_databases?.[0]?.database_id !== '81355b8d-8d94-4c48-8e58-fab82b7c1323') throw new Error('Unexpected Worker resources');
      const directory = await mkdtemp('/tmp/mailcheck-tracking-proxy-');
      const configPath = resolve(directory, 'wrangler.jsonc');
      // D1 only; no routes, no secrets. Staging and production share this database.
      await writeFile(configPath, JSON.stringify({ name: 'mailcheck-tracking-migration', account_id: config.account_id,
        compatibility_date: config.compatibility_date,
        d1_databases: config.d1_databases.map((binding) => ({ ...binding, remote: true })) }));
      proxy = await getPlatformProxy({ configPath, envFiles: [], persist: false, remoteBindings: true });
      db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });
    } else if (localBindings) {
      proxy = await getPlatformProxy({ configPath: resolve(root, 'wrangler.jsonc'), envFiles: [], remoteBindings: false });
      db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });
    } else {
      db = new Kysely({ dialect: createDialect({ url: resolve(databaseFile) }) });
    }

    const registry = new SchemaRegistry(db);
    const existing = await registry.getCollectionWithFields(TRACKING_TARGETS_COLLECTION);
    const { fields, ...collectionInput } = trackingTargetsCollection;
    const missingFields = fields.filter((field) => !existing?.fields?.some((f) => f.slug === field.slug));
    const repo = new ContentRepository(db);
    const plan = [];
    const conflicts = [];
    for (const entry of valid) {
      const slug = trackingTargetSlug(entry.kind, entry.key);
      const item = existing ? await repo.findBySlug(TRACKING_TARGETS_COLLECTION, slug, 'en') : null;
      if (!item) plan.push({ slug, entry });
      else if (item.data.kind !== entry.kind || item.data.key !== entry.key || item.data.url !== entry.url || item.status !== 'published') {
        conflicts.push(`${slug}: exists (${item.status}) with different data; left unchanged`);
      }
    }
    for (const conflict of conflicts) console.warn(`KEEP ${conflict}`);
    console.log(`${remote ? 'REMOTE' : 'LOCAL'} ${apply ? 'APPLY' : 'PLAN'}: collection ${existing ? 'exists' : 'will be created'}, ` +
      `${missingFields.length} fields to add, ${plan.length} entries to create and publish, ${conflicts.length} left unchanged, ${errors.length} invalid.`);
    for (const { slug, entry } of plan) console.log(`  + ${slug}: ${entry.kind} ${entry.key} -> ${entry.url}`);
    if (!apply) return;

    if (!existing) await registry.createCollection(collectionInput);
    for (const field of missingFields) await registry.createField(TRACKING_TARGETS_COLLECTION, field);
    for (const { slug, entry } of plan) {
      const created = await handleContentCreate(db, TRACKING_TARGETS_COLLECTION, {
        slug,
        locale: 'en',
        data: { title: entry.title, kind: entry.kind, key: entry.key, url: entry.url, note: entry.note }
      });
      if (!created.success) throw new Error(`Create failed: ${slug}: ${created.error.message}`);
      const current = await handleContentGet(db, TRACKING_TARGETS_COLLECTION, created.data.item.id, 'en');
      if (!current.success) throw new Error(`Read failed: ${slug}: ${current.error.message}`);
      const published = await handleContentPublish(db, TRACKING_TARGETS_COLLECTION, created.data.item.id, { _rev: current.data._rev });
      if (!published.success) throw new Error(`Publish failed: ${slug}: ${published.error.message}`);
      console.log(`Published ${slug}`);
    }
    console.log('Done. Redeploy (or wait up to 1 h) if a Worker version with the TrackingTargets entrypoint already served this table.');
  } finally {
    await db?.destroy();
    await proxy?.dispose();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
