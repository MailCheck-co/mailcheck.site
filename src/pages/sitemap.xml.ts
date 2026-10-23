import { getPublishedPosts } from '../routes/blog/_blog';
import { getCmsPagePaths, getCmsPostPaths, usesCms } from '../server/cms-content';
import { escapeXml } from '../server/cms-document';

const staticPaths = [
  '/', '/blog', '/videos', '/activecampaign-integration', '/integromat-integration',
  '/mailchimp-integration', '/mailerlite-integration', '/make-com-integration',
  '/n8n-integration', '/sendgrid-integration', '/woodpecker-integration',
  '/zapier-integration', '/affiliates', '/create-api-key', '/faq',
  '/case-studies/king-billy-4x-deposit-conversion'
];

export async function GET() {
  const urls = usesCms()
    ? ['/', '/blog', '/videos', '/case-studies/king-billy-4x-deposit-conversion', ...await getCmsPagePaths(), ...await getCmsPostPaths()]
    : [...staticPaths, ...(await getPublishedPosts()).map((post) => `/blog/${post.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((path) => `<url><loc>https://mailcheck.co${escapeXml(path)}</loc><changefreq>weekly</changefreq></url>`)
    .join('')}</urlset>`;
  return new Response(body, { headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=600' } });
}
