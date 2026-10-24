import { mkdtemp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPlatformProxy } from 'wrangler';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import {
  ContentRepository,
  RevisionRepository,
  handleContentGet,
  handleContentPublish
} from 'emdash';
import { createCmsSeed } from './prepare-cms-seed.mjs';
import { readWranglerConfig } from './read-wrangler-config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const apply = process.argv.includes('--apply');
const targetSlugs = new Set([
  '10-tips-to-warm-up-your-cold-emails',
  '5-marketing-tasks-you-must-automate-asap',
  '7-reasons-to-enforce-email-marketing',
  'automated-email-list-monitoring-why-is-it-important',
  'crypto-marketing-agencies-in-2023',
  'email-verification-services-the-complete-guide-to-use',
  'email-bounce-rate-explaining-and-reduceing',
  'google-plus-is-shutting-down-so-what',
  'how-saas-onboarding-emails-can-improve-your-conversions',
  'mailcheck-helped',
  'maximizing-your-email-marketing-efforts-with-mailcheckcos-validation-features',
  'paid-g-suite-may-increase-email-bounce-rate',
  'six-tips-to-write-an-email',
  'top-digital-marketing-strategies-for-fmcg-in-2023',
  'what-is-branding-10-steps-to-creating-the-best-branding-strategy-for-your-ecommerce-store',
  'x-ways-to-increase-email-deliverability'
]);

const seed = await createCmsSeed(root);
const expected = new Map(
  seed.content.posts
    .filter((entry) => targetSlugs.has(entry.slug))
    .map((entry) => [entry.slug, entry])
);
const config = readWranglerConfig();
if (
  config.account_id !== '2c9835fef0d4f0bacd0ffe1399957f42' ||
  config.d1_databases?.[0]?.database_id !== '81355b8d-8d94-4c48-8e58-fab82b7c1323'
) {
  throw new Error('Unexpected CMS database');
}
const directory = await mkdtemp('/tmp/opencode/mailcheck-seo-');
const configPath = resolve(directory, 'wrangler.jsonc');
await writeFile(
  configPath,
  JSON.stringify({
    name: 'mailcheck-seo-migration',
    account_id: config.account_id,
    compatibility_date: config.compatibility_date,
    d1_databases: config.d1_databases.map((binding) => ({ ...binding, remote: true }))
  })
);
const proxy = await getPlatformProxy({
  configPath,
  envFiles: [],
  persist: false,
  remoteBindings: true
});
const db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });

try {
  const repo = new ContentRepository(db);
  const revisions = new RevisionRepository(db);
  for (const [slug, entry] of expected) {
    const item = await repo.findBySlug('posts', slug, 'en');
    if (!item || item.status !== 'published')
      throw new Error(`Expected published post missing: ${slug}`);
    if (item.draftRevisionId) throw new Error(`Refusing to overwrite pending draft: ${slug}`);
    const current = await handleContentGet(db, 'posts', item.id, 'en');
    if (!current.success) throw new Error(`Cannot read ${slug}: ${current.error.message}`);
    const title = String(entry.data.title ?? '');
    const description = String(entry.data.description ?? '');
    const currentTitle = String(item.data.title ?? '');
    const currentDescription = String(item.data.description ?? '');
    if (currentTitle === title && currentDescription === description) {
      console.log(`OK ${slug}`);
      continue;
    }
    console.log(
      `${apply ? 'UPDATE' : 'PLAN'} ${slug}: ${JSON.stringify({
        title: currentTitle,
        description: currentDescription
      })} -> ${JSON.stringify({ title, description })}`
    );
    if (apply) {
      const revision = await revisions.create({
        collection: 'posts',
        entryId: item.id,
        data: { ...item.data, title, description }
      });
      const staged = await repo.replaceDraftRevision('posts', item.id, revision.id, item);
      if (!staged) throw new Error(`Entry changed while staging ${slug}`);
      const afterStage = await handleContentGet(db, 'posts', item.id, 'en');
      if (!afterStage.success)
        throw new Error(`Cannot re-read ${slug}: ${afterStage.error.message}`);
      const result = await handleContentPublish(db, 'posts', item.id, {
        _rev: afterStage.data._rev
      });
      if (!result.success) throw new Error(`Publish failed for ${slug}: ${result.error.message}`);
    }
  }
} finally {
  await db.destroy();
  await proxy.dispose();
}
