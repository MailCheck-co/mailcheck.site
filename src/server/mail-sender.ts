import type { MailcheckBackendEnv } from './env';
import { defaultEmailValidator, type EmailValidator } from './email-validator';
import { escapeHtml, getClientIp, jsonResponse } from './http';

export const MIN_ALLOWED_EMAIL_TRUST_RATE = 40;
export const DEFAULT_CONTACT_TO_EMAIL = 'contact@mailcheck.co';
export const DEFAULT_CONTACT_SUBJECT = 'Mailcheсk form';
export const MAX_CONTACT_BODY_BYTES = 64 * 1024;

const CONTACT_FIELD_LIMITS: Record<string, number> = {
  name: 200,
  email: 320,
  subject: 10_000,
  referrer: 2_048,
  turnstileToken: 2_048
};

const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_VERIFY_TIMEOUT_MS = 5_000;

type TurnstileVerificationResult = 'valid' | 'invalid' | 'unavailable';

async function verifyTurnstileToken(
  request: Request,
  token: unknown,
  secret: string,
  fetchImpl: typeof fetch
): Promise<TurnstileVerificationResult> {
  if (typeof token !== 'string' || !token) return 'invalid';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_VERIFY_TIMEOUT_MS);
  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      idempotency_key: crypto.randomUUID()
    });
    const remoteIp = request.headers.get('cf-connecting-ip');
    if (remoteIp) body.set('remoteip', remoteIp);

    const response = await fetchImpl(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal
    });
    if (!response.ok) return 'unavailable';
    const result = (await response.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };
    return result.success === true &&
      result.action === 'contact' &&
      result.hostname === new URL(request.url).hostname
      ? 'valid'
      : 'invalid';
  } catch {
    return 'unavailable';
  } finally {
    clearTimeout(timeout);
  }
}

async function readRequestTextLimited(request: Request, maxBytes: number): Promise<string | null> {
  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) return null;
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

export interface SendContactEmailOptions {
  toEmail?: string;
  subject?: string;
  html: string;
  text?: string;
  env: MailcheckBackendEnv;
  fetchImpl?: typeof fetch;
}

/**
 * Sends a contact form email through Cloudflare Email Sending's native Worker
 * binding. The sender domain must be onboarded in Cloudflare Email Sending.
 *
 * Throws an explicit error if the binding or sender is not configured — never
 * pretends success.
 */
export async function sendContactEmail(options: SendContactEmailOptions): Promise<void> {
  const {
    env,
    html,
    text = htmlToPlainText(html),
    toEmail = env.CONTACT_TO_EMAIL || DEFAULT_CONTACT_TO_EMAIL,
    subject = env.CONTACT_SUBJECT || DEFAULT_CONTACT_SUBJECT
  } = options;

  const senderEmail = env.CONTACT_FROM_EMAIL;
  if (env.EMAIL && senderEmail) {
    await env.EMAIL.send({
      from: { email: senderEmail, name: 'Mailcheck Landing' },
      to: toEmail,
      subject,
      html,
      text
    });
    return;
  }

  throw new Error(
    'Contact email sender is not configured: provide the Cloudflare EMAIL binding and CONTACT_FROM_EMAIL'
  );
}

/**
 * Builds the HTML body for the contact email with full HTML escaping on keys and values.
 */
export function buildContactFormHtml(payload: Record<string, unknown>): string {
  let template = '<h2>Contact form from mailcheck.co</h2>';
  for (const key of Object.keys(payload)) {
    template += `<p><b>${escapeHtml(key)}: </b>${escapeHtml(payload[key])}</p>`;
  }
  return template;
}

export function buildContactFormText(payload: Record<string, unknown>): string {
  return Object.keys(payload)
    .map((key) => `${key}: ${String(payload[key] ?? '')}`)
    .join('\n');
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export async function handleSendMailRequest(
  request: Request,
  env: MailcheckBackendEnv,
  validator: EmailValidator = defaultEmailValidator,
  fetchImpl: typeof fetch = fetch
): Promise<Response> {
  let pb: Record<string, unknown>;
  try {
    const rawBody = await readRequestTextLimited(request, MAX_CONTACT_BODY_BYTES);
    if (rawBody === null) {
      return jsonResponse({ error: 'wrong input params (json expected)' }, 400);
    }
    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return jsonResponse({ error: 'wrong input params (json expected)' }, 400);
    }
    pb = parsed as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'wrong input params (json expected)' }, 400);
  }

  for (const [field, maxLength] of Object.entries(CONTACT_FIELD_LIMITS)) {
    const value = pb[field];
    if (value !== undefined && (typeof value !== 'string' || value.length > maxLength)) {
      return jsonResponse({ error: `wrong input params (${field} expected)` }, 400);
    }
  }

  const userEmail = typeof pb.email === 'string' ? pb.email.trim() : '';
  if (!userEmail) {
    return jsonResponse({ error: 'wrong input params (email expected)' }, 400);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const turnstileResult = await verifyTurnstileToken(
      request,
      pb.turnstileToken,
      env.TURNSTILE_SECRET_KEY,
      fetchImpl
    );
    if (turnstileResult === 'unavailable') {
      return jsonResponse({ error: 'turnstile verification unavailable' }, 503);
    }
    if (turnstileResult !== 'valid') {
      return jsonResponse({ error: 'turnstile verification failed' }, 403);
    }
  }

  const reqIp = getClientIp(request);
  let usedWorkersRateLimiter = false;
  if (env.CONTACT_RATE_LIMITER && reqIp) {
    try {
      const result = await env.CONTACT_RATE_LIMITER.limit({ key: reqIp });
      usedWorkersRateLimiter = true;
      if (!result.success) {
        return jsonResponse({ code: '429', message: 'rate limit reached for ip ' + reqIp }, 429);
      }
    } catch {
      // Binding errors fall back to the isolate-local validator limiter.
    }
  }
  const { code, data } = await validator.validate(
    userEmail,
    reqIp,
    env,
    fetchImpl,
    usedWorkersRateLimiter
  );

  if (code === 429) {
    return jsonResponse(data, 429);
  }

  const trustRate = typeof data?.trustRate === 'number' ? data.trustRate : 0;
  if (code !== 200 || !trustRate || trustRate < MIN_ALLOWED_EMAIL_TRUST_RATE) {
    return jsonResponse(data, 412);
  }

  const { turnstileToken: _turnstileToken, ...contactPayload } = pb;
  const template = buildContactFormHtml(contactPayload);
  const text = buildContactFormText(contactPayload);

  try {
    await sendContactEmail({
      html: template,
      text,
      env,
      fetchImpl
    });
    return jsonResponse({ data: 'ok' }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: message }, 500);
  }
}
