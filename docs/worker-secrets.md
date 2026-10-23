# Worker secrets and integration readiness

Target: `mailcheck-site`, account `2c9835fef0d4f0bacd0ffe1399957f42`.
The zone's production DNS is not changed by these steps.

```sh
npm run readiness:secrets
```

This read-only check uses `wrangler secret list` (names/types only) and the
checked-in top-level `vars` names. Missing groups cause exit code 1. Presence
does not prove correct values, service-account JSON fields, API permissions or
external delivery. On 2026-10-18 it reported all backend groups missing.

## Enter values without disclosing them

Use the Cloudflare dashboard's Worker **Settings → Variables and Secrets**,
marking credentials as secrets, or use Wrangler interactively in your own
terminal. Confirm the account and Worker first. Do not paste values in chat,
command arguments, the repository, screenshots or logs.

```sh
npx wrangler secret put MAILCHECK_API_KEY
```

Each `secret put` prompts for the value privately. Do not copy placeholders as
real values. Existing production credentials must come from an authorized
owner/secret manager; do not scrape old deployment files or expose OAuth tokens.

### Required configuration groups

- **Email validation:** `MAILCHECK_API_KEY`; optional `MAILCHECK_API_URL` override.
- **Contact delivery:** Cloudflare Email Sending's native `EMAIL` binding and
  `CONTACT_FROM_EMAIL` (which may be stored as a secret), where the sender domain has been onboarded in Cloudflare
  Email Sending. The recipient defaults to `contact@mailcheck.co`, configurable
  with `CONTACT_TO_EMAIL`. No Gmail password or OAuth credentials are required.
  Check the domain with `npx wrangler email sending list`; onboarding is done
  with `npx wrangler email sending enable mailcheck.co` or in the Cloudflare
  dashboard. The binding is configured in `wrangler.jsonc` for staging and
  production.
- **Turnstile:** in the Cloudflare dashboard, open **Turnstile → Add widget**,
  choose **Managed** mode, and allow `mailcheck.co` and
  `mailcheck-site.dev-2c9.workers.dev`. Store the public site key as the
  `TURNSTILE_SITE_KEY` plain variable in `wrangler.jsonc`. The owner must enter
  the secret privately with `npx wrangler secret put TURNSTILE_SECRET_KEY`;
  never paste it into chat, command arguments, screenshots, or logs.
- **Tracking targets are CMS data, not bindings.** The legacy
  `<key>.l.mailcheck.co` DNS TXT records became entries of the CMS collection
  **Tracking targets** (`tracking_targets`: kind `short_link`, key, URL; key
  `*` is the fallback for unknown keys, like the DNS wildcard). Email-open,
  email-click, postback, BigQuery and Sheets tracking were retired. Only
  published short-link entries are live.
  Handlers read them through the `TrackingTargets` Worker entrypoint, cached in
  Workers Cache (tag `tracking_targets`, 1 h TTL, new cache per deploy) plus a
  30 s per-isolate memo; publish/unpublish/delete/restore purges via the
  `mailcheck-tracking-targets` CMS plugin. Create the collection and import:
  export the zone in Cloudflare Dashboard → mailcheck.co (and the image/redirect
  zones) → DNS → Records → Import and Export → Export, then
  `npm run cms:tracking -- --remote --zone-file <export.txt>
--short-link-domain l.mailcheck.co` (plan), add `--apply` to write.
  `--json <file>` imports a list instead. `npm run readiness:secrets` checks that
  short-link entries are published.
- **CMS encryption:** configure and securely back up `EMDASH_ENCRYPTION_KEY`
  before storing CMS provider/plugin secrets. Follow the installed EmDash key
  generation procedure in your own terminal (`npx emdash secrets generate
--help`); never rotate an existing key casually, because old encrypted values
  may become unreadable. Passkey ownership is a separate browser operation.

Non-secret IDs and destinations may be stored as Worker variables, but the
deployment config must preserve them; plain dashboard variables are not covered
by `wrangler secret list`. The readiness script only sees checked-in variables
and remote secret names, so it may report dashboard-only plain variables as
missing. Either track appropriate non-secret variables in config or verify them
directly in the dashboard. Never put credentials in config to satisfy the check.

### Turnstile local test keys

Cloudflare's official dummy keys work on localhost. For a passing visible or
Managed widget, use site key `1x00000000000000000000AA` with secret key
`1x0000000000000000000000000000000AA`. The invisible passing site key is
`1x00000000000000000000BB`; the forced-interactive visible site key is
`3x00000000000000000000FF`. Failure testing can use site key
`2x00000000000000000000AB`; the invisible failure site key is
`2x00000000000000000000BB`. The always-failing secret is
`2x0000000000000000000000000000000AA`, and duplicate-token testing uses
`3x0000000000000000000000000000000AA`. Use these only for local/testing
configuration, never production. Source:
https://developers.cloudflare.com/turnstile/troubleshooting/testing/

## Legacy Firebase configuration mapping

| Legacy key                                                        | Worker variable                                                             | Classification                |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------- |
| `mailcheck.link`                                                  | `MAILCHECK_API_URL`                                                         | Plain var (optional override) |
| `mailcheck.key`                                                   | `MAILCHECK_API_KEY`                                                         | **Secret**                    |
| `mailcheck.dns_txt_redirect_domain`                               | CMS `tracking_targets` short-link entries (import from the DNS zone export) | CMS data                      |
| `mailcheck.dns_txt_image_domain`, `mailcheck.reject_redirect_url` | Retired; no Worker equivalent                                               | Removed                       |
| `gmail.email`, `gmail.password`                                   | Retired; replaced by Cloudflare Email Sending                               | Removed                       |

Firebase's `firebase` application config and the old Google service-account,
BigQuery and Sheets integrations are not migrated; those tracking features were
removed.

## End-to-end acceptance (explicit owner involvement)

After configuration, rerun the name-only check. Then, using an approved test
address and destination, verify email validation, one real contact delivery and
the imported `/l/*` short links. These tests can consume API credits or send
mail: agree on the exact fixtures before executing them. No such live tests
have been performed as part of the draft import.

Do not expose a public endpoint returning credential values or detailed secret
state, and do not declare the backend production-ready from unit tests alone.
