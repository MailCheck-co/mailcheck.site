import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { test } from 'node:test';
import * as shared from '../configs/tracking-targets-collection.mjs';
import { parseZoneTxtRecords, targetsFromZone, validateTargets } from '../scripts/tracking-targets.mjs';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'cloudflare:workers') {
      return { shortCircuit: true, url: 'data:text/javascript,export const exports = globalThis.__trackingExports;' };
    }
    if (specifier === '../server/tracking-targets') {
      return nextResolve('../server/tracking-targets.ts', context);
    }
    return nextResolve(specifier, context);
  }
});

let purges = 0;
globalThis.__trackingExports = { TrackingTargets: { purge: async () => { purges += 1; } } };
const runtime = await import('../src/server/tracking-targets.ts');
const plugin = (await import('../src/cms/tracking-targets-plugin.ts')).createPlugin();

test('runtime and CMS schema share kinds and validation patterns', () => {
  assert.deepEqual([...runtime.TRACKING_KINDS], shared.TRACKING_KINDS);
  assert.equal(runtime.TRACKING_KEY_PATTERN, shared.TRACKING_KEY_PATTERN);
  assert.equal(runtime.TRACKING_URL_PATTERN, shared.TRACKING_URL_PATTERN);
  assert.equal(runtime.TRACKING_TARGETS_COLLECTION, shared.TRACKING_TARGETS_COLLECTION);
  const kind = shared.trackingTargetsCollection.fields.find((field) => field.slug === 'kind');
  assert.deepEqual(kind.validation.options, shared.TRACKING_KINDS);
});

test('buildTrackingTargets normalizes keys and skips invalid rows', () => {
  const { targets, skipped } = runtime.buildTrackingTargets([
    { kind: 'short_link', key: 'Pricing', url: 'https://mailcheck.co/pricing', updated_at: '2026-10-02' },
    { kind: 'short_link', key: 'x', url: 'javascript:alert(1)' },
    { kind: 'image', key: 'x', url: 'https://example.com' }
  ]);
  assert.equal(targets.short_link.pricing, 'https://mailcheck.co/pricing');
  assert.equal(skipped.length, 2);
});

test('findTrackingTarget: exact key, then `*`, else error', () => {
  const targets = runtime.emptyTrackingTargets();
  targets.short_link = { '*': 'https://mailcheck.co/404', pricing: 'https://mailcheck.co/pricing' };
  assert.equal(runtime.findTrackingTarget(targets, 'short_link', 'PRICING').href, 'https://mailcheck.co/pricing');
  assert.equal(runtime.findTrackingTarget(targets, 'short_link', 'missing').href, 'https://mailcheck.co/404');
  assert.equal(runtime.findTrackingTarget(targets, 'short_link', 'x'.repeat(500)).href, 'https://mailcheck.co/404');
  const empty = runtime.emptyTrackingTargets();
  assert.throws(() => runtime.findTrackingTarget(empty, 'short_link', undefined), /No short_link tracking target/);
});

test('getTrackingTargets memoizes per source, coalesces concurrent loads and fails on errors', async () => {
  runtime.resetTrackingTargetsMemo();
  await assert.rejects(runtime.getTrackingTargets(undefined), /not configured/);
  let calls = 0;
  const table = runtime.emptyTrackingTargets();
  const source = {
    async fetch(url) {
      calls += 1;
      assert.equal(url, runtime.TRACKING_TARGETS_URL);
      return Response.json(table);
    }
  };
  const [a, b] = await Promise.all([runtime.getTrackingTargets(source, 0), runtime.getTrackingTargets(source, 0)]);
  assert.deepEqual(a, table);
  assert.equal(a, b);
  await runtime.getTrackingTargets(source, 29_000);
  assert.equal(calls, 1);
  await runtime.getTrackingTargets(source, 31_000);
  assert.equal(calls, 2);
  runtime.resetTrackingTargetsMemo();
  await assert.rejects(runtime.getTrackingTargets({ fetch: async () => new Response(null, { status: 503 }) }), /HTTP 503/);
});

test('zone export import maps TXT records under the short-link domain', () => {
  const records = parseZoneTxtRecords([
    '$ORIGIN mailcheck.co.',
    '*.l.mailcheck.co.\t1\tIN\tTXT\t"https://mailcheck.co/404"',
    'pricing.l 1 IN TXT "https://mailcheck.co/" "pricing" ; split string',
    '_dmarc 1 IN TXT "v=DMARC1; p=none"'
  ].join('\n'));
  assert.equal(records.get('pricing.l.mailcheck.co'), 'https://mailcheck.co/pricing');
  const entries = targetsFromZone(records, { short_link: 'l.mailcheck.co' });
  assert.deepEqual(entries.map(({ kind, key, url }) => `${kind}|${key}|${url}`).sort(), [
    'short_link|*|https://mailcheck.co/404',
    'short_link|pricing|https://mailcheck.co/pricing'
  ]);
  assert.equal(shared.trackingTargetSlug('short_link', '*'), 'short-link-default');
});

test('import validation rejects bad kinds, keys, URLs and duplicates', () => {
  const { valid, errors } = validateTargets([
    { kind: 'short_link', key: 'A', url: 'https://mailcheck.co/a' },
    { kind: 'short_link', key: 'a', url: 'https://mailcheck.co/b' },
    { kind: 'short_link', key: '-bad', url: 'https://mailcheck.co/c' },
    { kind: 'short_link', key: 'x', url: 'ftp://example.com' },
    { kind: 'nope', key: 'x', url: 'https://example.com' }
  ]);
  assert.equal(valid.length, 1);
  assert.equal(valid[0].key, 'a');
  assert.equal(errors.length, 4);
});

test('CMS plugin purges the tracking cache only for tracking_targets state changes', async () => {
  const hooks = ['content:afterPublish', 'content:afterUnpublish', 'content:afterDelete', 'content:afterRestore'];
  for (const name of hooks) {
    const hook = plugin.hooks[name];
    assert.ok(hook, name);
    await hook.handler({ collection: 'legacy_posts', content: {} }, {});
    await hook.handler({ collection: 'tracking_targets', content: {} }, {});
  }
  assert.equal(purges, hooks.length);
  assert.equal(plugin.hooks['content:afterSave'], undefined);
});
