// Worker-only. Serves the CMS tracking table as JSON through Workers Cache.
// Named entrypoints are not reachable from the internet: only the default
// export receives eyeball traffic, handlers reach this via `ctx.exports`.
//
// Workers Cache purges are scoped to the entrypoint that calls them, so CMS
// hooks invalidate through the `purge()` RPC below rather than `cache.purge`
// from the default entrypoint.
import { WorkerEntrypoint } from 'cloudflare:workers';
import { TRACKING_TARGETS_TAG, loadTrackingTargetsFromD1 } from './tracking-targets';

interface TrackingTargetsEnv {
  DB: D1Database;
}

export class TrackingTargets extends WorkerEntrypoint<TrackingTargetsEnv> {
  override async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    try {
      const { targets, skipped } = await loadTrackingTargetsFromD1(this.env.DB);
      if (skipped.length > 0) {
        console.warn(`tracking_targets: skipped ${skipped.length} invalid published entries: ${skipped.join(', ')}`);
      }
      return new Response(JSON.stringify(targets), {
        headers: {
          'Content-Type': 'application/json',
          // CMS hooks purge on every change; the TTL only bounds staleness if a
          // purge is ever missed.
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=60',
          'Cache-Tag': TRACKING_TARGETS_TAG
        }
      });
    } catch (error) {
      console.error('tracking_targets: load failed', error instanceof Error ? error.message : error);
      return new Response(null, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
  }

  async purge(): Promise<void> {
    const cacheContext = this.ctx.cache;
    if (cacheContext) {
      await cacheContext.purge({ tags: [TRACKING_TARGETS_TAG] });
      return;
    }
    const { cache } = await import('cloudflare:workers');
    await cache.purge({ tags: [TRACKING_TARGETS_TAG] });
  }
}
