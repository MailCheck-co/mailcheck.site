import { BLOG_PAGE_SIZE, getPublishedPosts } from '../routes/blog/_blog';
import { getCmsPages, usesCms } from '../server/cms-content';
import { escapeXml } from '../server/cms-document';
import { toIsoDate } from '../utils/json-ld';

const staticPaths = [
  '/',
  '/blog',
  '/videos',
  '/activecampaign-integration',
  '/integromat-integration',
  '/mailchimp-integration',
  '/mailerlite-integration',
  '/make-com-integration',
  '/n8n-integration',
  '/sendgrid-integration',
  '/woodpecker-integration',
  '/zapier-integration',
  '/affiliates',
  '/create-api-key',
  '/faq',
  '/case-studies/king-billy-4x-deposit-conversion'
];

type SitemapEntry = { path: string; lastmod?: string };

const sitemapDate = (...values: unknown[]) => {
  for (const value of values) {
    const isoDate = toIsoDate(
      value instanceof Date ? value.toISOString() : typeof value === 'string' ? value : ''
    );
    if (isoDate) return isoDate;
  }
  return undefined;
};

const latestSitemapDate = (posts: Array<Record<string, unknown>>) => {
  const dates = posts
    .map((post) => sitemapDate(post.updatedAt, post.publishedAt, post.createdAt, post.date))
    .filter((date): date is string => Boolean(date));
  return dates.sort().at(-1);
};

const legacyPageModules = import.meta.glob('../routes/**/index.md') as Record<
  string,
  () => Promise<{ frontmatter?: Record<string, unknown>; metadata?: Record<string, unknown> }>
>;

async function getLegacyPageEntries(): Promise<SitemapEntry[]> {
  const dates = new Map<string, string>();
  for (const [source, resolver] of Object.entries(legacyPageModules)) {
    const module = await resolver();
    const metadata = module.frontmatter ?? module.metadata ?? {};
    const route = source.replace(/^\.\.\/routes\//, '').replace(/\/index\.md$/, '');
    const lastmod = sitemapDate(metadata.date);
    if (lastmod) dates.set(`/${route}`, lastmod);
  }
  return staticPaths.map((path) => ({
    path,
    ...(dates.has(path) ? { lastmod: dates.get(path) } : {})
  }));
}

export async function GET() {
  const archivePosts = await getPublishedPosts();
  const cms = usesCms();
  const cmsPages = cms ? await getCmsPages() : [];
  const postEntries: SitemapEntry[] = archivePosts
    .filter((post) => post.noindex !== true && post.noindex !== 'true')
    .map((post) => ({
      path: `/blog/${post.slug}`,
      lastmod: sitemapDate(post.updatedAt, post.publishedAt, post.createdAt, post.date)
    }));
  const pageCount = Math.ceil(archivePosts.length / BLOG_PAGE_SIZE);
  const paginationEntries: SitemapEntry[] = Array.from(
    { length: Math.max(0, pageCount - 1) },
    (_, index) => ({
      path: `/blog/${index + 2}`,
      lastmod: latestSitemapDate(
        archivePosts.slice((index + 1) * BLOG_PAGE_SIZE, (index + 2) * BLOG_PAGE_SIZE)
      )
    })
  );
  const blogLastmod = latestSitemapDate(archivePosts.slice(0, BLOG_PAGE_SIZE));
  const baseEntries: SitemapEntry[] = cms
    ? [
        { path: '/' },
        { path: '/blog', lastmod: blogLastmod },
        ...paginationEntries,
        { path: '/videos' },
        { path: '/case-studies/king-billy-4x-deposit-conversion' }
      ]
    : (await getLegacyPageEntries()).map((entry) =>
        entry.path === '/blog' ? { ...entry, lastmod: blogLastmod } : entry
      );
  const pageEntries: SitemapEntry[] = cmsPages.map((page) => ({
    path: `/${page.slug}`,
    lastmod: sitemapDate(page.updatedAt, page.publishedAt, page.createdAt, page.date)
  }));
  const entries = [
    ...baseEntries,
    ...pageEntries,
    ...(!cms ? paginationEntries : []),
    ...postEntries
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries
    .map(
      ({ path, lastmod }) =>
        `<url><loc>https://mailcheck.co${escapeXml(path)}</loc>${
          lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
        }<changefreq>weekly</changefreq></url>`
    )
    .join('')}</urlset>`;
  return new Response(body, {
    headers: { 'content-type': 'application/xml', 'cache-control': 'public, max-age=600' }
  });
}
