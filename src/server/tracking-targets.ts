// Short-link targets edited in the CMS (`tracking_targets` collection).
// They replace the legacy `<key>.l.mailcheck.co` DNS TXT records.
// `*` is the fallback for unknown keys, exactly like the DNS wildcard record.
// Keys are case-insensitive, as DNS names were.
//
// No `cloudflare:workers` import here: this module runs under Node tests.

export const TRACKING_TARGETS_COLLECTION = 'tracking_targets';
export const TRACKING_TARGETS_TAG = 'tracking_targets';
export const TRACKING_TARGETS_URL = 'https://tracking-targets.internal/v1';
export const TRACKING_KINDS = ['short_link'] as const;
export type TrackingKind = (typeof TRACKING_KINDS)[number];
export type TrackingTargets = Record<TrackingKind, Record<string, string>>;

/** `*`, or a DNS-label-like short-link key. */
export const TRACKING_KEY_PATTERN = '^(?:\\*|[a-z0-9](?:[a-z0-9._-]{0,126}[a-z0-9])?)$';
const keyRe = new RegExp(TRACKING_KEY_PATTERN);
/** http(s) URL used as a short-link destination. */
export const TRACKING_URL_PATTERN = '^https?://[^\\s"\'\\\\]+$';
const urlRe = new RegExp(TRACKING_URL_PATTERN);

export interface TrackingTargetRow {
  kind: unknown;
  key: unknown;
  url: unknown;
  updated_at?: unknown;
}

export function normalizeTrackingKey(key: string): string {
  return key.trim().toLowerCase();
}

export function emptyTrackingTargets(): TrackingTargets {
  return { short_link: {} };
}

/**
 * Builds the lookup table from published rows. Invalid rows are skipped (and
 * reported) rather than failing every tracking request; for duplicate
 * kind+key pairs the most recently updated entry wins.
 */
export function buildTrackingTargets(rows: TrackingTargetRow[]): { targets: TrackingTargets; skipped: string[] } {
  const targets = emptyTrackingTargets();
  const skipped: string[] = [];
  const sorted = [...rows].sort((a, b) => String(a.updated_at ?? '').localeCompare(String(b.updated_at ?? '')));
  for (const row of sorted) {
    const kind = row.kind as TrackingKind;
    const key = typeof row.key === 'string' ? normalizeTrackingKey(row.key) : '';
    const url = typeof row.url === 'string' ? row.url.trim() : '';
    if (!TRACKING_KINDS.includes(kind) || !keyRe.test(key) || !urlRe.test(url) || !isHttpUrl(url)) {
      skipped.push(`${String(row.kind)}:${String(row.key)}`);
      continue;
    }
    targets[kind][key] = url;
  }
  return { targets, skipped };
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** Exact key, else the `*` fallback (DNS wildcard semantics). */
export function findTrackingTarget(targets: TrackingTargets, kind: TrackingKind, key: string | undefined): URL {
  const normalized = normalizeTrackingKey(key ?? '*');
  const value = (normalized.length <= 128 ? targets[kind][normalized] : undefined) ?? targets[kind]['*'];
  if (!value) throw new Error(`No ${kind} tracking target for this key`);
  return new URL(value);
}

/** Published entries straight from EmDash's collection table. */
export async function loadTrackingTargetsFromD1(db: D1Database): Promise<{ targets: TrackingTargets; skipped: string[] }> {
  // EmDash keeps the live version in the columns of collections with drafts;
  // pending edits live in revisions until published.
  const { results } = await db
    .prepare(`SELECT kind, key, url, updated_at FROM ec_${TRACKING_TARGETS_COLLECTION}
      WHERE status = 'published' AND deleted_at IS NULL`)
    .all<TrackingTargetRow>();
  return buildTrackingTargets(results ?? []);
}

/** Anything with `fetch`, e.g. the `TrackingTargets` loopback entrypoint stub. */
export interface TrackingTargetsSource {
  fetch(input: string): Promise<Response>;
}

// Per-isolate memo in front of Workers Cache: a CMS change reaches every
// isolate within this window after the edge entry is purged.
const MEMO_TTL_MS = 30_000;
let memo: { source: TrackingTargetsSource; value: TrackingTargets; expires: number } | null = null;
let inflight: { source: TrackingTargetsSource; promise: Promise<TrackingTargets> } | null = null;

export function resetTrackingTargetsMemo(): void {
  memo = null;
  inflight = null;
}

export async function getTrackingTargets(source: TrackingTargetsSource | undefined, now = Date.now()): Promise<TrackingTargets> {
  if (!source) throw new Error('Tracking targets are not configured');
  if (memo && memo.source === source && memo.expires > now) return memo.value;
  if (inflight && inflight.source === source) return inflight.promise;
  const promise = (async () => {
    const response = await source.fetch(TRACKING_TARGETS_URL);
    if (!response.ok) throw new Error(`Tracking targets unavailable: HTTP ${response.status}`);
    const value = (await response.json()) as TrackingTargets;
    memo = { source, value, expires: now + MEMO_TTL_MS };
    return value;
  })();
  inflight = { source, promise };
  try {
    return await promise;
  } finally {
    if (inflight?.promise === promise) inflight = null;
  }
}
