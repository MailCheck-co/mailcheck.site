import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ host }) => {
  const maxAge: number = 600;
  const requestedPosts = await fetch(`http://${host}/blog.json`).then((res) => res.json());
  const body = render(requestedPosts);
  const headers = {
    'Cache-Control': `max-age=0, s-max-age=${maxAge}`,
    'Content-Type': 'application/xml',
  };
  return {
    headers,
    body
  }
};

const render = (posts: any[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="https://www.mailcheck.co/rss" rel="self" type="application/rss+xml" />
    <title>Mailcheck | Blog</title>
    <link>https://www.mailcheck.co/</link>
    <description>An application to clean your subscription list from bounces, and enrich data with customers. Verify your real customers in one way</description>
    ${posts
      .map(
        (post) => `<item>
          <guid>https://www.mailcheck.co/blog/${post.slug}</guid>
          <title>${post.title}</title>
          <link>https://www.mailcheck.co/blog/${post.slug}</link>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${post.desc}</description>
          </item>`
      )
      .join('')}
  </channel>
</rss>`;
