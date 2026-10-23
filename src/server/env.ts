import type { TrackingTargetsSource } from './tracking-targets';

/** Runtime configuration used by the remaining API and short-link handlers. */
export interface MailcheckBackendEnv {
  MAILCHECK_API_URL?: string;
  MAILCHECK_API_KEY?: string;

  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_SUBJECT?: string;
  EMAIL?: SendEmail;

  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;

  /** CMS-backed short-link targets, exposed through the named Worker entrypoint. */
  TRACKING_TARGETS?: TrackingTargetsSource;
  /** D1 binding used by CMS runtime. */
  DB?: D1Database;

  CONTACT_RATE_LIMITER?: {
    limit(options: { key: string }): Promise<{ success: boolean }>;
  };
}

export interface RouteContextLike {
  request: Request;
  url?: URL;
  params?: Record<string, string | undefined>;
  locals?: {
    runtime?: { env?: MailcheckBackendEnv & Record<string, unknown> };
    env?: MailcheckBackendEnv & Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

type StringEnvKey = {
  [K in keyof MailcheckBackendEnv]-?: Exclude<MailcheckBackendEnv[K], undefined> extends string
    ? K
    : never;
}[keyof MailcheckBackendEnv];

const ENV_KEYS: StringEnvKey[] = [
  'MAILCHECK_API_URL',
  'MAILCHECK_API_KEY',
  'CONTACT_FROM_EMAIL',
  'CONTACT_TO_EMAIL',
  'CONTACT_SUBJECT',
  'TURNSTILE_SITE_KEY',
  'TURNSTILE_SECRET_KEY'
];

function getProcessEnv(): Record<string, string | undefined> {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env ?? {};
}

function getImportMetaEnv(): Record<string, unknown> {
  try {
    return (import.meta as unknown as { env?: Record<string, unknown> }).env ?? {};
  } catch {
    return {};
  }
}

function getSafeRuntimeEnv(locals?: RouteContextLike['locals']): Record<string, unknown> {
  if (!locals || typeof locals !== 'object') return {};
  const merged: Record<string, unknown> = {};
  try {
    if (locals.env && typeof locals.env === 'object') Object.assign(merged, locals.env);
  } catch {}
  try {
    const runtime = locals.runtime;
    if (runtime?.env && typeof runtime.env === 'object') Object.assign(merged, runtime.env);
  } catch {}
  return merged;
}

export function resolveEnv(
  contextOrEnv?: RouteContextLike | MailcheckBackendEnv | null
): MailcheckBackendEnv {
  const processEnv = getProcessEnv();
  const metaEnv = getImportMetaEnv();
  let explicitEnv: Record<string, unknown> = {};
  if (contextOrEnv && typeof contextOrEnv === 'object') {
    if ('request' in contextOrEnv && contextOrEnv.request instanceof Request) {
      explicitEnv = getSafeRuntimeEnv((contextOrEnv as RouteContextLike).locals);
    } else {
      explicitEnv = contextOrEnv as Record<string, unknown>;
    }
  }
  const resolved: MailcheckBackendEnv = {};
  for (const key of ENV_KEYS) {
    const value = explicitEnv[key] ?? metaEnv[key] ?? processEnv[key];
    if (typeof value === 'string' && value.length > 0) resolved[key] = value;
  }
  const trackingTargets = explicitEnv.TRACKING_TARGETS;
  if (trackingTargets && typeof (trackingTargets as { fetch?: unknown }).fetch === 'function') {
    resolved.TRACKING_TARGETS = trackingTargets as TrackingTargetsSource;
  }
  const email = explicitEnv.EMAIL;
  if (email && typeof (email as { send?: unknown }).send === 'function') {
    resolved.EMAIL = email as SendEmail;
  }
  const db = explicitEnv.DB;
  if (db && typeof (db as { prepare?: unknown }).prepare === 'function')
    resolved.DB = db as D1Database;
  const rateLimiter = explicitEnv.CONTACT_RATE_LIMITER;
  if (
    rateLimiter &&
    typeof rateLimiter === 'object' &&
    typeof (rateLimiter as { limit?: unknown }).limit === 'function'
  ) {
    resolved.CONTACT_RATE_LIMITER = rateLimiter as NonNullable<
      MailcheckBackendEnv['CONTACT_RATE_LIMITER']
    >;
  }
  return resolved;
}

export function extractRequestAndEnv(
  contextOrRequest: RouteContextLike | Request,
  maybeEnv?: MailcheckBackendEnv,
  cloudflareEnv?: MailcheckBackendEnv
): { request: Request; env: MailcheckBackendEnv; params: Record<string, string | undefined> } {
  if (contextOrRequest instanceof Request) {
    return {
      request: contextOrRequest,
      env: resolveEnv({ ...cloudflareEnv, ...maybeEnv }),
      params: {}
    };
  }
  const contextEnv = resolveEnv(contextOrRequest);
  return {
    request: contextOrRequest.request,
    env: resolveEnv({ ...contextEnv, ...cloudflareEnv, ...maybeEnv }),
    params: contextOrRequest.params ?? {}
  };
}
