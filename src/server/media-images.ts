const widths = [320, 440, 640, 880, 1280, 1760];
const formats = { avif: 'image/avif', webp: 'image/webp', jpeg: 'image/jpeg', png: 'image/png' } as const;
const immutableKey = /^legacy\/[a-f0-9]{64}\.(?:png|jpe?g|webp|gif|avif)$/;
const uploadKey = /^[A-Za-z0-9_-]+\.(?:png|jpe?g|webp|gif|avif)$/;

export function imageUrl(key: string, width = 880, format = 'webp'): string {
  return `/media/image/${key}?w=${width}&f=${format}`;
}

export function imageOptions(key: string, params: URLSearchParams) {
  const width = Number(params.get('w'));
  const format = params.get('f') ?? 'webp';
  if ((!immutableKey.test(key) && !uploadKey.test(key)) || !widths.includes(width) ||
      !/^[0-9]+$/.test(params.get('w') ?? '') || !Object.prototype.hasOwnProperty.call(formats, format) ||
      [...params.keys()].some((name) => !['w', 'f'].includes(name))) return null;
  return { width, format: format as keyof typeof formats, immutable: immutableKey.test(key) };
}

export interface ImageBindings { MEDIA: R2Bucket; IMAGES: ImagesBinding; }

export async function serveImage(request: Request, key: string, bindings: ImageBindings, cache: Cache): Promise<Response> {
  const options = imageOptions(key, new URL(request.url).searchParams);
  const error = (message: string, status: number) => new Response(message, { status, headers: { 'Cache-Control': 'no-store' } });
  if (!options) return error('Invalid image or transformation', 400);
  const { width, format } = options;
  // Explicit output format in canonical cache URLs: no Accept/Vary cache mixups.
  const canonical = new URL(imageUrl(key, width, format), request.url);
  // Metadata first: revalidations (browser or Workers Cache) cost one R2 HEAD
  // and never read or transform the original.
  const meta = await bindings.MEDIA.head(key);
  if (!meta) return error('Image not found', 404);
  if (!/^image\/(?:jpeg|png|webp|gif|avif)$/.test(meta.httpMetadata?.contentType ?? '')) {
    return error('Unsupported image type', 415);
  }
  if (meta.size > maxSourceBytes) return error('Image too large to transform', 413);
  // CMS Replace original can overwrite non-hashed keys. Cache by R2 version,
  // and require browser revalidation for those rather than serving stale bytes.
  canonical.searchParams.set('revision', meta.etag);
  const etag = `"${meta.etag}-${width}-${format}-q85-v1"`;
  const cacheControl = 'public, max-age=0, must-revalidate';
  const headers = { 'Content-Type': formats[format], 'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff', ETag: etag };
  if (ifNoneMatch(request, etag)) return new Response(null, { status: 304, headers });
  const hit = await cache.match(canonical.href);
  if (hit) return conditionalImage(request, hit);
  const source = await bindings.MEDIA.get(key, { onlyIf: { etagMatches: meta.etag } });
  // Replaced between HEAD and GET: let the client retry against the new version.
  if (!source || !('body' in source)) return error('Image changed, retry', 503);
  try {
    const result = await bindings.IMAGES.input(source.body).transform({ width, fit: 'contain' })
      .output({ format: formats[format], quality: 85 });
    const output = result.response();
    if (!output.ok || !output.body) return error('Image transformation unavailable', 502);
    const response = new Response(output.body, { headers });
    // Cache versioned bytes at the edge; mutable URLs still revalidate in the browser.
    const stored = response.clone();
    stored.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    await cache.put(canonical.href, stored);
    return response;
  } catch {
    return error('Image transformation unavailable', 502);
  }
}

// Images binding input limit is far above this; the cap bounds per-request
// cost for public, unauthenticated transforms (largest legacy original: ~14 MB).
const maxSourceBytes = 25 * 1024 * 1024;

function ifNoneMatch(request: Request, etag: string): boolean {
  const header = request.headers.get('if-none-match');
  if (!header) return false;
  return header.trim() === '*' || header.split(',').some((value) => value.trim().replace(/^W\//, '') === etag);
}

function conditionalImage(request: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  if (ifNoneMatch(request, headers.get('etag') ?? '')) {
    response.body?.cancel();
    return new Response(null, { status: 304, headers });
  }
  return new Response(response.body, { headers });
}
