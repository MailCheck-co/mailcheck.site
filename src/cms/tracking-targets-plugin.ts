// Native EmDash plugin (registered in astro.config.mjs). Purges the cached
// short-link table whenever the live state of a `tracking_targets` entry
// changes. Draft saves don't touch live columns, so they are not hooked.
// Scheduled publishing fires `content:afterPublish` too.
import { exports } from 'cloudflare:workers';
import { definePlugin } from 'emdash';
import { TRACKING_TARGETS_COLLECTION } from '../server/tracking-targets';

interface PurgeStub {
  purge(): Promise<void>;
}

async function purgeTrackingTargets(event: { collection: string }): Promise<void> {
  if (event.collection !== TRACKING_TARGETS_COLLECTION) return;
  const stub = (exports as unknown as { TrackingTargets?: PurgeStub }).TrackingTargets;
  if (!stub) {
    console.warn('tracking_targets: TrackingTargets entrypoint is not exported; cache not purged');
    return;
  }
  await stub.purge();
}

const hook = { handler: purgeTrackingTargets, errorPolicy: 'continue' as const, timeout: 10_000 };

export function createPlugin() {
  return definePlugin({
    id: 'mailcheck-tracking-targets',
    version: '1.0.0',
    hooks: {
      'content:afterPublish': hook,
      'content:afterUnpublish': hook,
      'content:afterDelete': hook,
      'content:afterRestore': hook
    }
  });
}

export default createPlugin;
