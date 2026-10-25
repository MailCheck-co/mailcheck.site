import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { describe, it } from 'node:test';
import sharp from 'sharp';

// Opt in to integration checks against a local preview or the staging Worker.
// No credentials, email sends, or production writes are needed.
const base = process.env.SITE_TEST_URL;
const fixture = JSON.parse(
  await readFile(new URL('../src/routes/videos/fallback.json', import.meta.url))
);
const fetchPage = async (path) => {
  const response = await fetch(new URL(path, base), { redirect: 'manual' });
  return { response, html: await response.text() };
};

describe('Public-site migration regressions', { skip: !base }, () => {
  it('serves 50 published posts with unique folder-based slugs', async () => {
    const { response, html } = await fetchPage('/blog.json');
    assert.equal(response.status, 200);
    const posts = JSON.parse(html);
    assert.equal(posts.length, 50);
    assert.equal(new Set(posts.map((post) => post.slug)).size, 50);
    assert.equal(posts[0].slug, 'mailcheck-helped');
    assert.ok(posts.every((post) => post.published && post.title && post.date));
  });

  it('preserves the public video feed without a YouTube credential', async () => {
    const { response, html } = await fetchPage('/videos.json');
    assert.equal(response.status, 200);
    assert.deepEqual(JSON.parse(html), fixture);
  });

  it('includes every published post in the RSS and sitemap', async () => {
    const rss = await fetchPage('/rss.xml');
    const sitemap = await fetchPage('/sitemap.xml');
    assert.equal(rss.response.status, 200);
    assert.equal(sitemap.response.status, 200);
    assert.equal((rss.html.match(/<item>/g) || []).length, 50);
    assert.equal((sitemap.html.match(/<loc>/g) || []).length, 70);
    assert.ok(rss.html.includes('/blog/mailcheck-helped'));
    assert.ok(sitemap.html.includes('/blog/mailcheck-helped'));
    assert.ok(sitemap.html.includes('/blog/2'));
    assert.match(
      sitemap.html,
      /<url><loc>https:\/\/mailcheck\.co\/blog\/mailcheck-helped<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/
    );
    assert.ok((sitemap.html.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length > 0);
    assert.match(rss.html, /<pubDate>\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
    assert.equal(rss.response.headers.get('cache-control'), 'public, max-age=0, must-revalidate');
  });

  for (const path of [
    '/',
    '/blog',
    '/blog/2',
    '/videos',
    '/faq',
    '/make-com-integration',
    '/blog/mailcheck-helped',
    '/case-studies/king-billy-4x-deposit-conversion'
  ]) {
    it(`renders SEO in the initial document and valid image URLs: ${path}`, async () => {
      const { response, html } = await fetchPage(path);
      assert.equal(response.status, 200);
      const head = html.split('</head>')[0];
      assert.match(head, /<title>.+ \| Mailcheck<\/title>/);
      assert.ok(head.includes(`rel="canonical" href="https://mailcheck.co${path}"`));
      assert.match(head, /<meta name="description" content="[^"]+"/);
      assert.match(head, /<meta name="robots" content="all"/);
      assert.match(head, /type="application\/ld\+json"/);
      assert.match(html, /<div id="svelte">/);
      assert.doesNotMatch(html, /(?:src|srcset)="(?:\[object Object\]|[^"<>]*validateArgs)/);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN');
    });
  }

  it('paginates the blog from newest to oldest posts', async () => {
    const first = await fetchPage('/blog');
    const second = await fetchPage('/blog/2');
    assert.equal(first.response.status, 200);
    assert.equal(second.response.status, 200);
    assert.match(first.html, /rel="next" href="https:\/\/mailcheck\.co\/blog\/2"/);
    assert.match(second.html, /rel="prev" href="https:\/\/mailcheck\.co\/blog"/);
    assert.match(second.html, /Older Mailcheck articles/);
    assert.match(second.html, /aria-current="page">2</);
    const last = await fetchPage('/blog/5');
    const beyond = await fetchPage('/blog/6');
    assert.equal(last.response.status, 200);
    assert.doesNotMatch(last.html, /rel="next"/);
    assert.equal(beyond.response.status, 404);
  });

  it('renders all FAQ summaries as interactive HTML, not code blocks', async () => {
    const { html } = await fetchPage('/faq');
    assert.equal((html.match(/<summary>/g) || []).length, 37);
    assert.equal((html.match(/<details>/g) || []).length, 37);
    assert.equal((html.match(/<div class="accordion-column (?:left|right)">/g) || []).length, 2);
    const videoIslands = [
      ...html.matchAll(/<astro-island[^>]*component-url="[^"]*video[^"]*"[^>]*client="visible"/g)
    ];
    assert.equal(videoIslands.length, 4);
    for (const { index = 0 } of videoIslands) {
      assert.ok(html.lastIndexOf('<details>', index) > html.lastIndexOf('</details>', index));
    }
    assert.doesNotMatch(html, /&lt;summary&gt;/);
  });

  it('renders one mobile menu toggle rather than overlapping duplicate IDs', async () => {
    const { html } = await fetchPage('/');
    assert.equal((html.match(/\bid="burger"/g) || []).length, 1);
    assert.match(html, /id="burger"[^>]*aria-controls="mobile-menu"[^>]*aria-expanded="false"/);
  });

  it('renders breadcrumbs, BreadcrumbList schema, and related articles on content pages', async () => {
    const post = await fetchPage('/blog/mailcheck-helped');
    assert.equal(post.response.status, 200);
    assert.match(post.html, /aria-label="Breadcrumb"/);
    assert.match(post.html, /Home/);
    assert.match(post.html, /Blog/);
    assert.match(post.html, /"@type":"BreadcrumbList"/);
    assert.match(post.html, /Related articles/);
    assert.match(post.html, /href="\/blog\/[a-z0-9-]+"/);

    const integration = await fetchPage('/n8n-integration');
    assert.equal(integration.response.status, 200);
    assert.match(integration.html, /aria-label="Breadcrumb"/);
    assert.match(integration.html, /Integrations/);
    assert.match(integration.html, /"@type":"BreadcrumbList"/);
  });

  it('exposes VideoObject structured data for tutorial pages', async () => {
    for (const path of [
      '/',
      '/videos',
      '/faq',
      '/mailchimp-integration',
      '/sendgrid-integration'
    ]) {
      const { response, html } = await fetchPage(path);
      assert.equal(response.status, 200);
      assert.match(html, /"@type":"VideoObject"/);
      assert.match(html, /"embedUrl":"https:\/\/www\.youtube\.com\/embed\//);
      assert.match(html, /"thumbnailUrl":"https:\/\/i\.ytimg\.com\/vi\/[^\"]+\/hqdefault\.jpg"/);
      assert.match(html, /aria-label="Play video:/);
    }
  });

  it('keeps metadata titles brand-safe and fixes duplicate descriptions', async () => {
    const home = await fetchPage('/');
    const n8n = await fetchPage('/n8n-integration');
    const duplicate = await fetchPage('/blog/mailcheck-helped');
    assert.doesNotMatch(home.html, /<title>[^<]*\| Mailcheck \| Mailcheck<\/title>/);
    assert.doesNotMatch(n8n.html, /<title>[^<]*\| Mailcheck \| Mailcheck<\/title>/);
    assert.match(duplicate.html, /553 businesses used smarter email validation/);
    assert.doesNotMatch(
      (await fetchPage('/blog/5-marketing-tasks-you-must-automate-asap')).html,
      /Some ideas that help you to build an effective email marketing strategy/
    );
  });

  it('preserves legacy heading anchors and page-specific social thumbnails', async () => {
    const guide = await fetchPage('/make-com-integration');
    assert.match(guide.html, /<h1 id="title"><a href="#title">/);
    const post = await fetchPage('/blog/10-abandoned-cart-hacks-that-rise-sales');
    assert.match(
      post.html,
      /property="og:image" content="https:\/\/mailcheck\.co\/_astro\/abandoned-cart-hacks\.[^"]+"/
    );
    assert.match(
      post.html,
      /name="twitter:image" content="https:\/\/mailcheck\.co\/_astro\/abandoned-cart-hacks\.[^"]+"/
    );
  });

  it('keeps Markdown blocks directly in the article flex layout', async () => {
    for (const path of ['/blog/mailcheck-helped', '/make-com-integration']) {
      const { html } = await fetchPage(path);
      assert.doesNotMatch(html, /class="legacy-markdown"/, path);
      assert.match(
        html,
        /class="content-block[^"]*"[^>]*>\s*(?:<!--[\s\S]*?-->\s*|<astro-(?:static-)?slot[^>]*>\s*)*<h1 /,
        path
      );
    }
  });

  it('preserves the legacy 880px Markdown image transform', async () => {
    const { html } = await fetchPage('/blog/10-abandoned-cart-hacks-that-rise-sales');
    const image = html.match(/<img src="([^"]+)" alt="10 Abandoned Cart Hacks"/);
    assert.ok(image);
    const response = await fetch(new URL(image[1].replaceAll('&amp;', '&'), base));
    assert.equal(response.status, 200);
    const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata();
    assert.equal(metadata.width, 880);
    assert.equal(metadata.height, 586);
  });

  it('includes Contact Us only where the legacy route layout included it', async () => {
    for (const [path, expected] of [
      ['/blog/mailcheck-helped', true],
      ['/affiliates', true],
      ['/faq', true],
      ['/make-com-integration', false],
      ['/create-api-key', false],
      ['/terms', false]
    ]) {
      const { html } = await fetchPage(path);
      assert.equal(/<section\b[^>]*\bid="contact-us"/.test(html), expected, path);
    }
  });

  it('keeps promotion pages out of the search index', async () => {
    const { response, html } = await fetchPage('/promo/social-bee');
    assert.equal(response.status, 200);
    const head = html.split('</head>')[0];
    assert.match(head, /<meta name="robots" content="noindex"/);
    assert.doesNotMatch(head, /rel="canonical"/);
  });

  it('renders the legacy error page with 404 status and short cache lifetime', async () => {
    const { response, html } = await fetchPage('/not-a-real-page-for-migration-test');
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('cache-control'), 'max-age=300');
    assert.ok(html.includes("Requested page wasn't found"));
    assert.match(html, /http-equiv="refresh" content="5;https:\/\/mailcheck.co\/"/);
  });

  it('preserves configured redirect targets', async () => {
    for (const [path, target] of [
      ['/scholarship', '/blog/mailcheck-scholarship-2019'],
      ['/make-integration', '/make-com-integration'],
      ['/increaseEmailsDeliverability', '/blog/x-ways-to-increase-email-deliverability']
    ]) {
      const { response } = await fetchPage(path);
      assert.equal(response.status, 301);
      assert.equal(new URL(response.headers.get('location'), base).pathname, target);
    }
  });

  it('serves every checked-in Markdown route', async () => {
    const root = new URL('../src/routes/', import.meta.url);
    const entries = await readdir(root, { recursive: true });
    const paths = entries
      .filter((path) => path.endsWith('/index.md'))
      .map((path) => `/${path.replace(/\/index\.md$/, '')}`);
    // Bounded concurrency avoids hammering the D1-backed staging middleware.
    for (let i = 0; i < paths.length; i += 5) {
      await Promise.all(
        paths.slice(i, i + 5).map(async (path) => {
          const { response } = await fetchPage(path);
          assert.equal(response.status, 200, path);
        })
      );
    }
  });
});
