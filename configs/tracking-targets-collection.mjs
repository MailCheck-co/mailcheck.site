// CMS schema for short-link targets (replaces the DNS TXT records used by
// the Firebase internal redirect function). Shared by the tracking-target
// importer and the runtime plugin.
// Runtime counterpart: src/server/tracking-targets.ts — the patterns must
// match (asserted in tests/tracking-targets.test.mjs).

export const TRACKING_TARGETS_COLLECTION = 'tracking_targets';
export const TRACKING_KINDS = ['short_link'];
export const TRACKING_KEY_PATTERN = '^(?:\\*|[a-z0-9](?:[a-z0-9._-]{0,126}[a-z0-9])?)$';
export const TRACKING_URL_PATTERN = '^https?://[^\\s"\'\\\\]+$';

export const trackingTargetsCollection = {
  slug: TRACKING_TARGETS_COLLECTION,
  label: 'Tracking targets',
  labelSingular: 'Tracking target',
  description:
    'Short links served from /l/. Key "*" is the fallback for unknown keys. Only published entries are live; changes apply within ~30 seconds.',
  sortOrder: 2,
  routable: false,
  supports: ['drafts', 'revisions'],
  titleField: 'title',
  fields: [
    { slug: 'title', label: 'Title', type: 'string', required: true, searchable: true },
    {
      slug: 'kind',
      label: 'Kind (short_link)',
      type: 'select',
      required: true,
      validation: { options: TRACKING_KINDS }
    },
    {
      slug: 'key',
      label: 'Key (subdomain label; * = fallback; lowercase)',
      type: 'string',
      required: true,
      validation: { pattern: TRACKING_KEY_PATTERN, maxLength: 128 }
    },
    {
      slug: 'url',
      label: 'Target URL',
      type: 'string',
      required: true,
      validation: { pattern: TRACKING_URL_PATTERN, maxLength: 2048 }
    },
    { slug: 'note', label: 'Note', type: 'text' }
  ]
};

/** Deterministic slug so one kind+key pair maps to one entry. */
export function trackingTargetSlug(kind, key) {
  return `${kind.replace(/_/g, '-')}-${key === '*' ? 'default' : key.replace(/[^a-z0-9-]/g, '-')}`;
}
