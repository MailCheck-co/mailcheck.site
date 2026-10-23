# Cloudflare migration and staging verification

## Deployment

- Staging URL: <https://mailcheck-site.dev-2c9.workers.dev>
- Cloudflare account: `Dev@nodeart.io's Account` (`2c9835fef0d4f0bacd0ffe1399957f42`).
  The Cloudflare zone API confirmed this account owns `mailcheck.co`; the similarly
  named `Cloudflare@mailcheck.co` account does **not** own the zone.
- Worker: `mailcheck-site`, Astro 7 SSR with Svelte 5 compatibility components.
- Latest verified staging deployment: `40010581-51bb-4b9d-8739-6be5a0a1fba5`.
- D1: `mailcheck-cms`, R2: `mailcheck-media`, KV: `mailcheck-session`,
  Rate Limiting: `CONTACT_RATE_LIMITER` (8 requests / 60 s per IP).
- Only the `workers.dev` endpoint is configured. No production DNS or Worker
  routes were added. `mailcheck.co` continues to use its existing deployment.
- Firebase Hosting/Functions code, configs and workflows were removed from the
  repository (they remain in git history). The live Firebase landing stays up
  until cutover and is the rollback target.

`wrangler.jsonc` has two configurations of the **same** Worker:

| Command                     | Config           | Routes                            | Indexable                                          |
| --------------------------- | ---------------- | --------------------------------- | -------------------------------------------------- |
| `npm run deploy:staging`    | top level        | workers.dev only                  | no (`X-Robots-Tag: noindex`, robots `Disallow: /`) |
| `npm run deploy:production` | `env.production` | `mailcheck.co/*`, workers.dev off | yes                                                |

`deploy:production` **is** the cutover. It refuses to run without
`CONFIRM_PRODUCTION_DEPLOY=mailcheck.co` and a passing `readiness:secrets`.
After cutover never run `deploy:staging` again: it would detach the route and
mark the site noindex. CI (`.github/workflows/cloudflare.yml`) runs type checks,
unit tests and both builds on every PR/push; deploys are manual
(`workflow_dispatch`, target + confirmation, `production` GitHub environment).
`npm ci` needs `legacy-peer-deps` (set in `.npmrc`) because `svelte-inview@3`,
`svelte-slidy` and the Prettier/Stylelint plugins still declare Svelte 3 peers.

Indexability is a deployment variable (`MAILCHECK_INDEXABLE`), not a hostname
check: Workers Cache keys ignore the hostname. The bundle is about 5.4 MiB
compressed. EmDash scheduled publishing runs every 5 minutes. Invocation logs
are disabled because tracking URLs contain email addresses.

## Caching

Workers Cache (`cache.enabled`) sits in front of the Worker; every deploy starts
with an empty cache. Policy lives in `src/middleware.ts`:

- Code-only pages (home, videos, promo, case study): edge 1 day, browser
  `max-age=14400` as on Firebase.
- CMS pages, `/blog`, `/blog.json`, RSS, sitemap: edge 1 day tagged
  `legacy_posts`/`legacy_pages`, purged by EmDash on publish/edit/unpublish;
  browser `public, max-age=0, must-revalidate`.
- Preview, sessions, editors, Set-Cookie and all backend endpoints (`/api`,
  `/l`): never stored.
- `/media/image/*`: edge 60 s + background refresh; see
  `docs/cms-editorial-workflow.md`.

## Validation commands

```sh
npm run check -- --yes
npx tsc --noEmit
npm test            # backend, images, cms, rendering, media, readiness, edge
npm run cms:check
npm run build

# Start/restart the Cloudflare-compatible preview after rebuilding:
npx astro preview stop
npm run preview -- --port 4321
SITE_TEST_URL=http://localhost:4321 npm run test:site
CMS_LIFECYCLE_URL=http://localhost:4321 npm run test:cms-lifecycle

# Read-only integration checks against staging:
SITE_TEST_URL=https://mailcheck-site.dev-2c9.workers.dev npm run test:site
SITE_TEST_URL=https://mailcheck-site.dev-2c9.workers.dev npm run test:site-http
CMS_MEDIA_TEST_URL=https://mailcheck-site.dev-2c9.workers.dev npm run test:cms-media
```

`test:site` is opt-in and skips when `SITE_TEST_URL` is unset. It does not submit
contact forms, send email, or write to production. The video-feed equality check
assumes no YouTube API key overrides the checked-in fallback.

## Verified on 2026-10-18

- Backend unit tests: 13 passing (external services mocked).
- Image build-plugin unit tests: 3 passing, covering opt-in imports, legacy
  upscaling to 880 px, and development URLs without build-only asset emission.
- Public-site integration tests: 20 passing locally and on the deployed Worker,
  including Markdown image dimensions, layout, contact-section placement, the
  legacy flex shell, and a unique mobile menu toggle.
- A separate 80-route production/staging sweep covered all 66 sitemap URLs,
  legal/promotion/error pages, JSON feeds, XML feeds, robots, and redirects.
- All 80 probed HTTP statuses, decoded titles, and canonicals matched production
  (excluding the generated trailing-slash redirect document). Trailing-slash redirect bodies
  differ, though both tested endpoints returned a permanent redirect.
- `/blog.json`: all 50 records match production exactly, including ordering.
- `/videos.json`: all 7 records match the observed production feed exactly.
- RSS: 50 items. Sitemap: the same set of 66 URLs as production.
- FAQ: 37 actual `<summary>`/`<details>` elements; browser click opens an item.
- Titles, canonicals, descriptions, social tags, robots, and JSON-LD now render
  in Astro's initial document instead of relying on Svelte island hydration.
- Markdown heading anchors preserve IDs such as `#title` and `#snippet`.
- 224 distinct internal content image URLs returned HTTP 200 locally.
- Deployed homepage browser check found no broken loaded images. Desktop
  content starts at the same 90 px header boundary after hiding empty desktop
  mobile-menu buttons. A 390 px mobile smoke check confirmed no initial horizontal
  overflow and a working menu-open interaction. Full-page visual parity still
  needs sign-off.
- The independent desktop audit reported matching viewport screenshots for the
  home, blog index, FAQ, case study, and promo pages. These are sampled desktop
  comparisons, not a full-site or mobile pixel-parity guarantee.
- Follow-up review confirmed and repaired two Markdown regressions: an extra
  wrapper collapsed adjacent block margins, and standalone guides incorrectly
  included the Contact Us section. The legacy layouts include that section on
  blog and affiliate routes; FAQ owns its own contact section.
- Local and deployed browser comparisons after the fix: `/blog/mailcheck-helped` matches
  production's 2,560 px article height and 3,751 px full document height at the
  same desktop viewport. The Make guide's H1/H2 positions also match (H1 top
  114 px, H2 top 202.89 px), and its extra contact section is absent.
- Restoring the outer `#svelte` flex shell fixed the footer compositing mismatch.
  The deployed `/blog/mailcheck-helped` full-page desktop screenshot matched
  production exactly: 1,280 × 3,751 px, zero differing pixels. At a 390 × 844
  mobile viewport, both full captures were 390 × 6,001 px; 42 pixels differed
  within an 8 × 8 px footer region. This is sampled evidence, not a sitewide
  pixel-parity guarantee.
- Restored the legacy build-time Markdown image transform (`width=880`, WebP),
  including upscaling small sources. The abandoned-cart article's image is again
  880 × 586 px rather than 626 × 417 px; its desktop page height matches
  production at 5,184 px.
- CMS follow-up: all 65 Markdown routes now read published D1 content in the
  same renderer. The blog JSON still matches all 50 production records including
  equal-date ordering and null/absent thumbnail values. The signed-preview and
  unpublish lifecycle passes against local bindings; no staging content was
  temporarily edited for this lifecycle test.
- The CMS-rendered `/blog/mailcheck-helped` local and deployed captures match the previous
  staging captures exactly at both 1280 × 3751 and 390 × 6001 (zero differing
  pixels). This comparison isolates the CMS switch from the earlier visual fixes.
- Media verification covers HEAD metadata for all 431 unique R2 objects and a
  downloaded legacy transformed image SHA-256. Following editorial review, only
  216 originals remain in the media catalogue; 215 detached derivative R2 objects
  remain to preserve old URLs. New public content renditions are generated by
  the Worker Images binding with AVIF/WebP and responsive widths. Original and
  rendition URLs revalidate; edge-cache entries are keyed by R2 version.
- Originals-only media follow-up verified on staging: 216 catalogue entries,
  all 431 original/compatibility object URLs readable, decoded AVIF/WebP at
  880 × 586 and AVIF at 440 × 293, conditional requests returning 304, and
  all 20 public-site regression tests passing. A deployed browser check at
  1280px and 390px confirmed AVIF selection, no broken article images and no
  horizontal overflow; the desktop article image remains 880 × 586px.
- Fixed the video carousel's desktop CSS cascade after Svelte 5 changed scoped
  selector specificity. `/videos` now matches production's 352 px desktop slider
  height and 2,902 px document height. Mobile geometry also matches; a browser
  click on the second dot changes the active slide.
- Removed the duplicate, overlapping `#burger` button from the mobile header.
  One toggle retains `aria-controls` and `aria-expanded`; opening and closing it
  was verified with browser clicks at 390 px, without horizontal overflow.
- A deployed geometry audit sampled 13 routes at both 1,280 px and 390 px widths:
  home, two blog articles, videos, FAQ, affiliates, terms, privacy, cookies,
  create-api-key, N8N, Make.com, and the SocialBee promo. Document dimensions
  matched on 11 routes at both widths. The two remaining differences are the
  restored guide screenshots described below.
- The Make guide is **not pixel-identical**: production has 20 missing screenshot
  sources while the migration serves working screenshots. Their restored height
  makes the migration page longer (20,744 px vs 11,582 px in the sampled desktop
  comparison). This is an intentional restoration of content, not visual parity;
  it requires owner acceptance before cutover.
- The N8N guide also restores two empty production image sources (step 9 and 10).
  All preceding block positions and image sizes match. Restoring those screenshots
  adds 861 px on desktop (7,132 vs 6,271 px) and 638 px on mobile (5,593 vs
  4,955 px). Owner acceptance is also required for this content restoration.

The initial delegated audits found missing posts, broken SVG/raster imports,
empty videos, FAQ markup parsed as code, and stripped SSR SEO. These were fixed.
One audit also claimed routes that do not exist in this checkout and inconsistent
video counts; those claims were not used as evidence. Live responses are the
comparison baseline.

## Cutover blockers and intentionally preserved behavior

1. **Production secret readiness and live acceptance remain outstanding.** Configure
   `MAILCHECK_API_KEY`, Cloudflare Email Sending domain/binding, and the
   Turnstile site/secret keys as documented in `docs/worker-secrets.md`. The
   39 legacy `/l/*` destinations have been imported and published in the shared
   D1 `tracking_targets` collection; rerun `npm run readiness:secrets` after
   configuring the Worker. Enter secrets through a secure flow; never paste
   credentials into the repository or logs. The readiness check reports binding
   names only and does not validate credentials or delivery.
2. **Owner editorial acceptance is still required.** CMS-backed public rendering
   is implemented for 50 published posts and 15 published Markdown pages,
   together with blog JSON/listing, RSS and sitemap. The media catalogue contains
   216 original assets (218 source references); server-side resizing/AVIF/WebP
   delivery no longer creates separate editorial entries. Local lifecycle checks cover
   draft/preview/publish/pending edit/unpublish and sitemap noindex; public tests
   pass 20/20. Owner registration remains intact. Fresh owner sign-in, recovery
   and an owner-driven edit/preview/publish still need acceptance. Creating new
   entries needs an archival-field schema migration; editing existing entries
   works. Home/video/promo/case-study components remain code-managed. See
   `docs/cms-editorial-workflow.md` for recovery points, limitations and the
   origin-bound passkey warning. Secrets are not needed for this CMS work.
3. **Visual review is still required**, particularly mobile navigation, sliders,
   long Markdown pages, code highlighting, and content image sizing. HTTP/SEO
   checks alone do not establish pixel-level parity.
4. `/increaseEmailsDeliverability` intentionally keeps the legacy 301 target
   `/blog/x-ways-increase-emails-deliverability`, which is a 404 in production.
   Repairing that historical redirect should be a separate approved behavior
   change, not an accidental change during migration.
5. The video fallback is an observed production snapshot. Configure the build
   YouTube API key to refresh from the playlist, or update the snapshot when the
   playlist changes. It deliberately does not fetch its own production endpoint.
6. Existing Sass deprecation notices, three TypeScript API-deprecation hints,
   and dependency audit findings remain. The ContactUs background asset path's
   casing was repaired (`Footer`, not `footer`). Do not apply broad dependency
   fixes without revalidation.

Do not cut over `mailcheck.co` until these checks and owner sign-off are complete.

## Cutover runbook

Context: `email-functions-85073.web.app` (the retired Firebase email-tracking
functions) already returns 503. The replacement Worker supports the migrated
`/l/*` short links; email-open pixels, email-click tracking and postback logging
were intentionally removed because they are no longer used.
`mailcheck.space` redirects to `www.mailcheck.co`, which redirects to the apex
with path and query preserved.

Before:

1. Configure all required secrets and the Turnstile public variable in the
   Cloudflare dashboard; `npm run readiness:secrets` must pass. Never paste
   values into chat or shell. Confirm the published CMS short-link entries are
   present in the shared D1 database.
2. Owner sign-off on blockers 2 and 3 above, including one real contact-form
   delivery and representative `/l/*` redirects.
3. Zone `mailcheck.co` → Rules → Redirect Rules: `www.mailcheck.co/*` →
   `https://mailcheck.co/${1}` 301, preserve query string. Do this in the zone,
   not the Worker: Workers Cache ignores the hostname, so a Worker-side www
   redirect could be served to the apex from cache.
4. GitHub: secrets `CLOUDFLARE_API_TOKEN`, `VITE_YOUTUBE_API_KEY`; environment
   `production` with required reviewers.

Cutover: run the workflow with `target=production`, `confirm=mailcheck.co` (or
locally `CONFIRM_PRODUCTION_DEPLOY=mailcheck.co npm run deploy:production`). This
adds the `mailcheck.co/*` route in front of the existing proxied DNS record;
DNS itself does not change.

After:

1. `SITE_TEST_URL=https://mailcheck.co SITE_TEST_INDEXABLE=true npm run test:site-http`
   and `npm run test:site`.
2. Click representative migrated `/l/*` links and submit one approved contact
   form test. Confirm the expected redirect destinations and delivery.
3. Owner registers a passkey on `mailcheck.co` (passkeys are origin-bound; the
   workers.dev one does not work there).
4. Point `email-functions-85073.web.app` at `mailcheck.co` with a Firebase Hosting
   redirect if old emails still use that host; it cannot move to Cloudflare.
5. Keep the Firebase landing deployed for about a week as the rollback target.

Rollback: Workers & Pages → `mailcheck-site` → Settings → Domains & Routes →
remove `mailcheck.co/*`. Traffic returns to the Firebase origin immediately.
For a code-only regression use `npx wrangler rollback` instead.
