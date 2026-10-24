# CMS public content and editorial workflow

## Current state

The staging Worker uses D1/EmDash for the existing Markdown routes when
`MAILCHECK_CONTENT_SOURCE=cms` (configured in `wrangler.jsonc`):

- `posts` (Blog posts): 50 published blog posts, `/blog/{slug}`.
- `pages` (Pages): 15 published Markdown pages, `/{slug}`.

The remote publication counts were verified directly in
D1 after activation. The Markdown bootstrap seed intentionally remains drafts
and non-routable; activation is a separate guarded operation, not a seed edit.
Owner setup was completed by the user on 2026-10-18. Read-only verification
confirmed `needsSetup: false`, one admin user and one registered admin passkey;
the owner was not changed by activation. A fresh sign-in and
recovery method still need owner verification. No admin user was created by
automation. Public articles, the blog listing/JSON, RSS and sitemap now read
CMS publication state together. Unpublished/deleted entries return 404, even
when the original Markdown file still exists. CMS failures do not silently
serve archival source. `MAILCHECK_CONTENT_SOURCE` can be changed back to the
legacy renderer for a deliberate deployment rollback; do not do so as a
transparent fallback, since that would restore unpublished content.

Each imported entry retains the original Markdown body, selected frontmatter,
repository source path and original thumbnail reference. HTML, Svelte variables
and `<Video>` syntax are preserved rather than lossy-converted to rich text.
The media catalogue now contains **originals only**: 218 source references map
to 216 unique original assets (identical source bytes are deduplicated).
215 accidentally registered migration renditions were removed from the catalogue;
their R2 objects remain for old URLs and rollback compatibility. No content or
original bytes were deleted. `seed/media.json` separates original `assets` from
the old `compatibilityRenditions` inventory; `cms:media` prepares originals only
and `cms:activate` never registers derived variants as editorial assets.

Content images use `/media/image/{storageKey}?w=880&f=avif` (or `webp`), reading
the single original from R2 and transforming with the Cloudflare Images binding.
`picture`/`srcset` advertises AVIF and WebP at 440/880/1760px; the browser chooses
the supported format/size without an editor managing copies. Allowed transform
widths/formats are bounded, originals over 25 MB are refused (HTTP 413), and
SVG originals remain SVG. Transforms are never added to the media collection.

Caching (Workers Cache, `cache.enabled` in `wrangler.jsonc`; it works on
workers.dev and on zone routes alike):

- Transform responses are served from the Worker's edge cache for 60 s, then
  refreshed in the background. A refresh costs one R2 HEAD and, when the original
  is unchanged, no new transformation (ETag = R2 version + width + format).
  After **Replace original**, visitors see the new image within about a minute;
  browsers always revalidate (`max-age=0, must-revalidate`).
- Public CMS pages, `/blog`, `/blog.json`, RSS and sitemap are cached at the edge
  for up to a day and tagged `posts`/`pages`. EmDash purges those
  tags on publish, unpublish, edit, schedule and scheduled publication, so the
  next request renders fresh content. Browsers revalidate on every navigation.
- Preview links (`?_preview=`), signed-in editors and any `private`/`no-store`
  response are never stored. The edge key ignores cookies: an editor browsing a
  public URL may see the shared published copy, which is expected.
- Each deployment starts with an empty cache (the Worker version is part of the
  key). Home, videos, promo and case-study pages are code-managed and change only
  with a deployment.

Historical detached renditions remain immutable.
Existing social thumbnails retain their build URLs for SEO parity; newly edited
absolute/relative-root thumbnail URLs are supported. The import flags the missing
legacy `email-bounce-rate.jpg` thumbnail reference on `/blog/mailcheck-helped`;
it does not fabricate a replacement.

Home, blog listing, video listing, promotions and case-study Svelte components
are not included in these 65 Markdown entries. Migrating editable versions of
those components is separate work.

## Owner setup procedure (completed; login/recovery check still required)

1. Open <https://mailcheck-site.dev-2c9.workers.dev/_emdash/admin/setup> in your
   own browser, not an automated/headless session.
2. Use site title **Mailcheck** and retain the content import option if the
   wizard shows it. Reapplying skips existing drafts; do not reset D1.
3. Enter the intended owner's email/name and register a passkey with your own
   device or password manager. Do not send credentials or passkey material to
   an agent or paste them into chat.
4. Confirm Blog posts and Pages contain 50 and 15 published entries respectively.
5. Sign out and back in to verify the owner credential and keep a recovery
   credential/recovery method using the CMS-supported account controls.

**Origin matters:** a passkey created on the `workers.dev` hostname cannot be
used directly on unrelated `mailcheck.co`. Keep staging admin access available
during cutover. Before changing CMS origin, establish a CMS-supported
authentication/recovery path on the final origin; do not assume changing the
DNS migrates passkeys or disable authentication to work around it.

The setup window is now owner-claimed. Do not rerun setup or reset D1. The
earlier content import did not create an owner or assign a guessed email.

## Reproducible preparation

```sh
npm run cms:prepare
npm run cms:check
npm run test:cms
npm run cms:media
npm run test:cms-rendering
```

`scripts/prepare-cms-seed.mjs` regenerates `seed/seed.json` deterministically
from the repository, without network access or database writes. `cms:check`
fails if the generated seed is stale. This is a one-way bootstrap snapshot,
not a synchronization mechanism for edited CMS records.

For a disposable local rehearsal only:

```sh
npx emdash seed seed/seed.json --database /tmp/opencode/mailcheck-cms-rehearsal.sqlite --skip-media
```

The EmDash CLI command above writes a local SQLite database; it does **not**
import into remote D1. The initial staging import used the installed EmDash setup API
with `includeContent: true`, `onConflict: skip`, and its built-in query budget.
It created 65 drafts. A repeated local import created zero duplicates and
skipped all 65 existing entries. After owner setup, use authenticated supported
CMS tools for imports, not the unauthenticated setup endpoint.

Activation rehearsals (local binding seed/import must already be present):

```sh
npm run cms:activate -- --database /tmp/opencode/mailcheck-cms-rehearsal.sqlite
npm run cms:activate -- --database /tmp/opencode/mailcheck-cms-rehearsal.sqlite --apply
# Or operate on the local Wrangler bindings used by Astro preview:
npm run cms:activate -- --local-bindings --apply
CMS_LIFECYCLE_URL=http://localhost:4321 npm run test:cms-lifecycle
```

`cms:activate -- --remote` is a read-only plan pinned to the staging account,
Worker, D1 ID and R2 bucket. `--apply` uploads/checks media, updates collection
presentation/preview URLs and publishes only unchanged imported drafts. It
refuses edited/pending revisions and uses publication revision preconditions.
Successful activation records `mailcheck:cms_bootstrap_complete`; subsequent
runs refuse to republish editorially unpublished entries. It never configures
DNS, Worker custom domains, owner credentials or production integration secrets.
Do not use this bootstrap as an ongoing publishing tool.

## Editing existing content

1. Open <https://mailcheck-site.dev-2c9.workers.dev/_emdash/admin> and sign in.
2. Open Blog posts or Pages and select an existing entry.
3. Edit title, Markdown, description, snippet, original date (DD.MM.YYYY),
   reading time or thumbnail URL. Do not edit the repository source path or
   original frontmatter fields.
4. Save the draft, then use Preview. Preview links are signed, private/no-store,
   and noindex. Do not paste preview links into logs or public discussions.
5. Publish to make the article/listing/feed changes public. Saving a pending
   revision alone does not replace the live Markdown/title/snippet. The dedicated
   SEO panel is **not revisioned by EmDash 1.3**: its fields can update live SEO
   independently; use it deliberately. A true noindex excludes the entry from
   sitemap but not from the blog archive or RSS.
6. Unpublish removes the entry from public routes, blog listings, RSS and sitemap.

Public CMS documents/feeds are currently `private, no-store` so publication
changes cannot leave stale shared/browser HTML caches. Original media and their
versioned server-side transforms support revalidation. Raw Markdown HTML is sanitized (no script execution,
event handlers, arbitrary iframes or JavaScript URLs); FAQ tables/details,
heading anchors, legacy variable substitution and Video components remain.

**Scope limitation:** editing/previewing/publishing the existing content is
supported. Creating entirely new entries still requires a repository source path
because legacy relative image references resolve against it. Dashboard
quick-create is disabled; do not fabricate source paths to work around validation. Home,
promotions, case studies and video-list components remain code-managed.

## Recovery evidence

Before content import on 2026-10-18, D1 Time Travel bookmark:

`00000003-0000002a-00005108-c97df3febba70418dfc76ce332d51583`

Before public CMS/media activation, after owner registration:

`00000003-000001de-00005108-9e17136d55954f52b436fe945183495e`

Before removing derivative catalogue rows (2026-10-18):

`00000003-0000074c-00005108-3846f36e4c16abfdbce91f17657659fd`

Catalogue cleanup is `npm run cms:media-normalize -- --remote` (read-only plan),
then `--apply`. It is pinned to staging, verifies known migration checksums and
metadata, refuses edited/referenced derivatives, saves a recovery row snapshot
outside the repository and deletes no R2 objects. It leaves unrelated uploads
untouched and can safely be rerun. Do not use a general media-delete API for
this operation: that could also remove the objects required by old links.

Ordinary `wrangler d1 export` failed because EmDash has virtual/FTS tables.
No usable SQL backup was claimed and no tables were removed to bypass this.
Time Travel retention is plan-dependent (7 days Free / 30 days Paid); this is
not a permanent backup. Restoring overwrites D1 and can remove later users or
content. Obtain explicit approval and a current recovery point before any
restore. No restore was performed.

## Verification and remaining acceptance

- Verify a fresh owner sign-in and recovery method; owner/passkey creation is complete.
- Complete an owner-driven edit/preview/publish acceptance in staging.
- The local lifecycle test exercises draft 404, signed preview, publication,
  pending revision isolation, SEO noindex in sitemap, unpublish and republish.
  It only mutates disposable local bindings, never staging.
- Public-site regression suite: 20 checks, including all 65 Markdown URLs.
- CMS projection/sanitization/media tests: 5; existing CMS seed tests: 3.
- Sampled local/deployed CMS desktop/mobile article captures match the previous staging captures
  exactly (1280 × 3751 and 390 × 6001, zero differing pixels). This is sampled evidence, not a
  claim of sitewide pixel equality. Make/N8N screenshot restoration still needs
  owner sign-off, independently of the CMS switch.

Do not regenerate/reapply with `onConflict: update` over edited records without
review: that would overwrite editor work. Do not delete the legacy source until
the CMS-backed rendering and recovery path have been accepted.
