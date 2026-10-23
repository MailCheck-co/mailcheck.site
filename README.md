# mailcheck.co

Public site, CMS, contact form and short-link redirects for mailcheck.co: Astro 7 SSR with
Svelte components and EmDash CMS on a Cloudflare Worker (`mailcheck-site`,
D1 + R2 + KV). Firebase Hosting and Cloud Functions are retired.

```bash
npm ci
npm run dev          # local dev server
npm test             # unit tests (no network, no credentials)
npm run build        # Worker build into dist/
```

Deploys are manual (see `.github/workflows/cloudflare.yml`):

- `npm run deploy:staging` — workers.dev only, `noindex`. Only before cutover.
- `npm run deploy:production` — attaches `mailcheck.co/*`; requires
  `CONFIRM_PRODUCTION_DEPLOY=mailcheck.co` and passing readiness checks.

Docs:

- `docs/cloudflare-migration.md` — architecture, caching, cutover and rollback.
- `docs/worker-secrets.md` — runtime variables and secrets.
- `docs/cms-editorial-workflow.md` — editing content in the CMS.
