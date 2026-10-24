import { getPublishedPosts } from './blog/_blog';
import { escapeXml } from '../server/cms-document';
import { toIsoDate } from '../utils/json-ld';
export const GET = async () => {
  const maxAge = 600;
  const posts = await getPublishedPosts();
  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xml:base="https://mailcheck.co" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="https://mailcheck.co/rss.xml" rel="self" type="application/rss+xml" />
    <title>Mailcheck | Blog</title>
    <link>https://mailcheck.co/</link>
    <description>An application to clean your subscription list from bounces, and enrich data with customers. Verify your real customers in one way</description>
    ${posts
      .map(
        (post) => `<item>
           <guid>https://mailcheck.co/blog/${post.slug}</guid>
           <title>${escapeXml(post.title)}</title>
           <link>https://mailcheck.co/blog/${post.slug}</link>
           <pubDate>${escapeXml(
             new Date(`${toIsoDate(String(post.date)) ?? '1970-01-01'}T00:00:00Z`).toUTCString()
           )}</pubDate>
           <description>${escapeXml(post.description)}</description>
          </item>`
      )
      .join('')}
  </channel>
</rss>
`;
  const headers = {
    'Cache-Control': `max-age=0, s-maxage=${maxAge}`,
    'Content-Type': 'application/xml'
  };
  return new Response(body, { headers });
};
