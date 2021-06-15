import posts from './blog/_posts.js';

const sortedPosts = posts.sort((a, b) => {
  return new Date(a.data.date.split('.').reverse().toString()) <
    new Date(b.data.date.split('.').reverse().toString())
    ? 1
    : -1;
});
const render = (posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
	<title>mailcheck.co</title>
  <link>https://www.mailcheck.co/blog</link>
	<description>Posts from Mailcheck.co</description>
	${posts
    .map(
      (post) => `
		<item>
			<title>${post.data.title}</title>
			<link>https://www.mailcheck.co/blog/${post.data.slug}</link>
            <description><![CDATA[${post.data.snippet}]]></description>
			<pubDate>${new Date(post.data.date.split('.').reverse().toString()).toISOString()}</pubDate>
		</item>
	`
    )
    .join('')}
</channel>
</rss>`;

export function get(req, res, next) {
  res.setHeader('Cache-Control', `max-age=0, s-max-age=${600}`); // 10 minutes
  res.setHeader('Content-Type', 'application/rss+xml');
  const feed = render(sortedPosts);
  res.end(feed);
}
