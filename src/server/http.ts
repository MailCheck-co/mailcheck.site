const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Escapes untrusted strings for safe HTML interpolation.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] ?? ch);
}

/**
 * Sanitizes a URL for embedding inside `<meta http-equiv="refresh" content="0;URL='...'" />`.
 * Preserves query parameter `&` characters while encoding quotes and angle brackets
 * to prevent attribute or tag breakout.
 */
export function sanitizeMetaRefreshUrl(url: URL | string): string {
  const raw = typeof url === 'string' ? url : url.toString();
  return raw
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');
}

/**
 * Extracts client IP from Cloudflare or Fastly headers.
 */
export function getClientIp(request: Request): string | undefined {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('fastly-client-ip') ??
    undefined
  );
}

/**
 * Extracts client country code from Cloudflare headers.
 */
export function getClientGeo(request: Request): string | undefined {
  return request.headers.get('cf-ipcountry') ?? undefined;
}

/**
 * Extracts forwarded host header.
 */
export function getForwardedHost(request: Request): string | undefined {
  return request.headers.get('x-forwarded-host') ?? undefined;
}

/**
 * Decodes standard or URL-safe Base64 into a UTF-8 string using Web APIs.
 */
export function decodeBase64UrlSafe(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Encodes bytes or UTF-8 string into Base64URL without padding.
 */
export function toBase64Url(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function jsonResponse(
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...extraHeaders
    }
  });
}

export function htmlResponse(
  html: string,
  status = 200,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(html, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      ...extraHeaders
    }
  });
}

export function redirectResponse(location: string, status = 302): Response {
  return new Response(null, {
    status,
    headers: {
      location
    }
  });
}
