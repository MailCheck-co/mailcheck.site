import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { serveImage, type ImageBindings } from '../../../server/media-images';

// Workers Cache serves transforms without running the Worker for 60 s, then
// refreshes in the background (a conditional R2 HEAD, no re-transform when the
// original is unchanged). A CMS "Replace original" therefore reaches visitors
// within about a minute; browsers still revalidate via ETag on every view.
const EDGE_FRESH_SECONDS = 60;
const EDGE_STALE_SECONDS = 7 * 86400;

export const GET: APIRoute = async ({ request, params, cache }) => {
  try {
    const response = await serveImage(request, params.key ?? '', env as unknown as ImageBindings,
      await caches.open('mailcheck-images-v1'));
    if (cache?.enabled && (response.status === 200 || response.status === 304)) {
      cache.set({ maxAge: EDGE_FRESH_SECONDS, swr: EDGE_STALE_SECONDS });
    }
    return response;
  } catch {
    return new Response('Image service unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
