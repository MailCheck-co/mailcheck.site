import { env } from 'cloudflare:workers';
import { isIndexable, type EdgeEnv } from '../server/edge';

const production = 'User-agent: *\nDisallow: /l/*\n\nSitemap: https://mailcheck.co/sitemap.xml\n';
// Staging and any non-production deployment must stay out of search indexes.
const staging = 'User-agent: *\nDisallow: /\n';

export const GET = () => new Response(isIndexable(env as EdgeEnv) ? production : staging,
  { headers: { 'content-type': 'text/plain' } });
