import { defineMiddleware } from 'astro:middleware';
import { usesCms } from './server/cms-content';
import manifest from '../seed/media.json';

const originals = new Set(Object.entries(manifest.assets).filter(([key]) => key.endsWith('|original')).map(([, asset]) => asset.storageKey));

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if ((context.request.method === 'GET' || context.request.method === 'HEAD') &&
      response.status === 200 && /^\/_emdash\/api\/media\/file\/legacy\/[a-f0-9]{64}\.(?:png|jpe?g|webp|gif|svg)$/.test(context.url.pathname)) {
    // Originals can be replaced in CMS, even if their import key is a hash.
    const key = context.url.pathname.slice('/_emdash/api/media/file/'.length);
    response.headers.set('Cache-Control', originals.has(key) ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable');
  }
  // Match the former Firebase Hosting response policy for public routes only.
  if (!context.url.pathname.startsWith('/_emdash')) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade');
    response.headers.set('X-UA-Compatible', 'ie=edge');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    applyCachePolicy(context, response);
  }
  return response;
});

// Pages whose output depends only on the deployed code. Workers Cache keys
// entries by Worker version, so a deploy is their invalidation.
const codeOnlyPaths = new Set(['/', '/videos', '/videos.json', '/robots.txt',
  '/case-studies/king-billy-4x-deposit-conversion', '/promo/social-bee']);
// EmDash purges `[collection, id]` tags on publish/unpublish/update/schedule.
// Tagging every CMS-backed response with both collections makes any editorial
// change purge all affected pages, lists, feeds and the sitemap at once.
const cmsTags = ['legacy_posts', 'legacy_pages'];
const EDGE_TTL = 86400;

type Context = Parameters<Parameters<typeof defineMiddleware>[0]>[0];

function applyCachePolicy(context: Context, response: Response) {
  const { pathname, searchParams } = context.url;
  const isRead = context.request.method === 'GET' || context.request.method === 'HEAD';
  const isBackend = /^(?:\/api|\/l|\/media)(?:\/|$)/.test(pathname);
  if (!isRead || isBackend) return;
  const isPreview = searchParams.has('_preview');
  const hasSession = isPreview || context.cookies.has('astro-session') ||
    context.cookies.has('emdash-edit-mode') || context.request.headers.has('authorization') ||
    Boolean((context.locals as { user?: unknown }).user);
  if (isPreview) {
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  // The edge cache key ignores cookies and auth: anything personalised,
  // previewed or already marked private must never be stored there.
  if (hasSession || response.headers.has('set-cookie') ||
      /private|no-store/i.test(response.headers.get('Cache-Control') ?? '')) {
    if (context.cache?.enabled) context.cache.set(false);
    response.headers.set('Cache-Control', 'private, no-store');
    return;
  }
  const isHtml = response.headers.get('content-type')?.includes('text/html') ?? false;
  if (response.status === 404) {
    if (isHtml) response.headers.set('Cache-Control', 'max-age=300');
    return;
  }
  if (response.status !== 200) return;
  const dependsOnCms = usesCms() && !codeOnlyPaths.has(pathname);
  if (context.cache?.enabled) {
    context.cache.set({ maxAge: EDGE_TTL, swr: EDGE_TTL, ...(dependsOnCms ? { tags: cmsTags } : {}) });
  }
  // Browsers revalidate CMS-backed responses against the edge so a publish is
  // visible on the next navigation; code-only HTML keeps the Firebase policy.
  if (dependsOnCms) response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  else if (isHtml) response.headers.set('Cache-Control', 'max-age=14400');
}
