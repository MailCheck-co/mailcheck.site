import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import { d1, r2 } from '@emdash-cms/cloudflare';
import { cloudflareEmail } from '@emdash-cms/cloudflare/plugins';
import emdash from 'emdash/astro';
import { legacyImages } from './configs/legacy-images.mjs';

export default defineConfig({
  site: 'https://mailcheck.co',
  output: 'server',
  trailingSlash: 'never',
  redirects: {
    '/scholarship': '/blog/mailcheck-scholarship-2019',
    '/make-integration': '/make-com-integration',
    '/increaseEmailsDeliverability': '/blog/x-ways-to-increase-email-deliverability'
  },
  publicDir: './static',
  adapter: cloudflare(),
  // Workers Cache in front of the Worker (`cache.enabled` in wrangler.jsonc).
  // Routes opt in from src/middleware.ts; EmDash purges collection tags on
  // publish, unpublish, edit and scheduled publication.
  cache: { provider: cacheCloudflare() },
  integrations: [
    svelte(),
    react({ include: ['**/*.{jsx,tsx}'] }),
    emdash({
      siteUrl: 'https://mailcheck.co',
      database: d1({ binding: 'DB' }),
      storage: r2({ binding: 'MEDIA' }),
      plugins: [
        cloudflareEmail({
          from: { email: 'contact@mailcheck.co', name: 'Mailcheck CMS' }
        }),
        {
          // Purges the cached short-link table (src/server/tracking-targets.ts).
          id: 'mailcheck-tracking-targets',
          version: '1.0.0',
          format: 'native',
          entrypoint: fileURLToPath(new URL('./src/cms/tracking-targets-plugin.ts', import.meta.url))
        }
      ]
    })
  ],
  vite: {
    plugins: [legacyImages()],
    resolve: {
      alias: {
        $lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
        $utils: fileURLToPath(new URL('./src/utils', import.meta.url))
      }
    }
  },
  devToolbar: { enabled: false }
});
