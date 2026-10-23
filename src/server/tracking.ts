import { findTrackingTarget, getTrackingTargets, resetTrackingTargetsMemo } from './tracking-targets';
import type { MailcheckBackendEnv } from './env';
import {
  htmlResponse,
  sanitizeMetaRefreshUrl
} from './http';

export const DEFAULT_FALLBACK_REDIRECT_URL = 'https://mailcheck.co/';
/**
 * Clears the in-memory tracking-target cache (useful in tests).
 */
export function resetTrackingCaches(): void {
  resetTrackingTargetsMemo();
}

export function requestUrlToHostname(url: URL): string | undefined {
  const match = url.pathname.match(/^\/l\/([^\s\\]+)$/);
  if (!match) {
    return undefined;
  }
  return match[1];
}

export function mergeRedirectSearchParams(redirectUrl: URL, requestUrl: URL): URL {
  const result = new URL(redirectUrl.toString());
  for (const [key, value] of requestUrl.searchParams) {
    result.searchParams.set(key, value);
  }
  return result;
}

/**
 * Handler for `/l/*` internal short-link redirects (`functions/internal-redirect.js`).
 */
export async function handleInternalRedirectRequest(
  request: Request,
  env: MailcheckBackendEnv,
  _fetchImpl: typeof fetch = fetch
): Promise<Response> {
  const requestUrl = new URL(request.url);
  const matchKey = requestUrlToHostname(requestUrl);

  if (!matchKey) {
    let fallbackUrl: URL;
    try {
      fallbackUrl = findTrackingTarget(await getTrackingTargets(env.TRACKING_TARGETS), 'short_link', '*');
    } catch {
      fallbackUrl = new URL(DEFAULT_FALLBACK_REDIRECT_URL);
    }
    const safeFallback = sanitizeMetaRefreshUrl(fallbackUrl);
    return htmlResponse(
      `<html><head><meta http-equiv="refresh" content="0;URL='${safeFallback}'" /></head></html>`,
      200
    );
  }

  try {
    // Unknown keys use the `*` entry, like the former `*.l.mailcheck.co` record.
    let redirectUrl = findTrackingTarget(await getTrackingTargets(env.TRACKING_TARGETS), 'short_link', matchKey);
    redirectUrl.searchParams.set('from', matchKey);
    redirectUrl = mergeRedirectSearchParams(redirectUrl, requestUrl);

    const safeRedirect = sanitizeMetaRefreshUrl(redirectUrl);
    return htmlResponse(
      `<html><head><meta http-equiv="refresh" content="0;URL='${safeRedirect}'" /><link rel="canonical" href="https://mailcheck.co"/><meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /><meta http-equiv="Pragma" content="no-cache" /><meta http-equiv="Expires" content="0" /></head></html>`,
      200
    );
  } catch {
    return new Response('Tracking target unavailable', { status: 500 });
  }
}
