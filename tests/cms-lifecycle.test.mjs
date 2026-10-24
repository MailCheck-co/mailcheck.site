import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getPlatformProxy } from 'wrangler';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import {
  ContentRepository,
  OptionsRepository,
  generatePreviewToken,
  handleContentCreate,
  handleContentPublish,
  handleContentUnpublish,
  handleContentUpdate
} from 'emdash';

// Mutates only disposable LOCAL bindings, never staging. A unique fixture is
// unpublished/trashed in finally. Preview signing material stays in memory.
const base = process.env.CMS_LIFECYCLE_URL;
test(
  'CMS draft → preview → publish → pending edit → unpublish lifecycle',
  { skip: !base },
  async () => {
    const url = new URL(base);
    assert.ok(
      ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname),
      'Only a local preview may be mutated'
    );
    const proxy = await getPlatformProxy({
      configPath: 'wrangler.jsonc',
      envFiles: [],
      remoteBindings: false
    });
    const db = new Kysely({ dialect: new D1Dialect({ database: proxy.env.DB }) });
    const repo = new ContentRepository(db);
    const slug = `cms-lifecycle-${crypto.randomUUID()}`;
    let id;
    const unwrap = (result) => {
      assert.equal(result.success, true, result.error?.message);
      return result.data;
    };
    const get = async (path, cookie) => {
      const response = await fetch(new URL(path, base), { headers: cookie ? { cookie } : {} });
      return { response, html: await response.text() };
    };
    const feeds = async (visible) => {
      for (const path of ['/blog.json', '/blog', '/rss.xml', '/sitemap.xml']) {
        const { response, html } = await get(path, 'emdash-edit-mode=true');
        assert.equal(response.status, 200);
        assert.equal(html.includes(slug), visible, `${path}: fixture visibility`);
        assert.ok(!html.includes('PRIVATE-PENDING-TEXT'), `${path}: no pending draft leak`);
        assert.ok(!html.includes('PRIVATE-METADATA-TEXT'), `${path}: no private metadata leak`);
      }
    };
    try {
      const data = {
        title: 'CMS lifecycle public title',
        markdown: 'Public article text.\n\n## Public heading',
        description: 'CMS lifecycle test description',
        snippet: 'Public snippet',
        legacy_date: '25.10.2026',
        reading_time: '1 min read',
        noindex: false,
        canonical: '',
        thumbnail_source: '',
        source_path: 'src/routes/blog/cms-lifecycle/index.md',
        legacy_metadata: { private: 'PRIVATE-METADATA-TEXT' }
      };
      const created = unwrap(
        await handleContentCreate(db, 'posts', { slug, status: 'draft', locale: 'en', data })
      );
      id = created.item.id;
      assert.equal((await get(`/blog/${slug}`)).response.status, 404);
      await feeds(false);

      const options = new OptionsRepository(db);
      await options.setIfAbsent('emdash:preview_secret', crypto.randomUUID() + crypto.randomUUID());
      const secret = await options.get('emdash:preview_secret');
      assert.ok(
        typeof secret === 'string' && secret.length > 0,
        'Local CMS preview signing must be initialized'
      );
      const token = await generatePreviewToken({
        contentId: `posts:${id}`,
        secret,
        expiresIn: '5m'
      });
      const preview = await get(`/blog/${slug}?_preview=${encodeURIComponent(token)}`);
      assert.equal(preview.response.status, 200);
      assert.ok(preview.html.includes('Public article text.'));
      assert.match(preview.response.headers.get('cache-control'), /private.*no-store/);
      assert.match(preview.response.headers.get('x-robots-tag'), /noindex/);

      unwrap(await handleContentPublish(db, 'posts', id));
      let publicPage = await get(`/blog/${slug}`);
      assert.equal(publicPage.response.status, 200);
      assert.ok(publicPage.html.includes('Public article text.'));
      await feeds(true);
      // Use revision-aware staging (the admin runtime does this too); the raw
      // handleContentUpdate helper writes columns directly and is not an editor save.
      await repo.updateDraftAware('posts', id, {
        data: {
          markdown: 'PRIVATE-PENDING-TEXT',
          title: 'PRIVATE-PENDING-TEXT',
          snippet: 'PRIVATE-PENDING-TEXT'
        }
      });
      publicPage = await get(`/blog/${slug}`, 'emdash-edit-mode=true');
      assert.ok(!publicPage.html.includes('PRIVATE-PENDING-TEXT'));
      assert.ok(publicPage.html.includes('Public article text.'));
      const pendingPreview = await get(`/blog/${slug}?_preview=${encodeURIComponent(token)}`);
      assert.ok(pendingPreview.html.includes('PRIVATE-PENDING-TEXT'));
      await feeds(true);

      unwrap(await handleContentUpdate(db, 'posts', id, { seo: { noIndex: true } }));
      assert.ok(
        !(await get('/sitemap.xml')).html.includes(slug),
        'SEO noindex excludes the post from sitemap'
      );
      assert.match((await get(`/blog/${slug}`)).html, /name="robots" content="noindex"/);
      unwrap(await handleContentUpdate(db, 'posts', id, { seo: { noIndex: false } }));
      assert.ok((await get('/sitemap.xml')).html.includes(slug));

      unwrap(await handleContentUnpublish(db, 'posts', id));
      assert.equal((await get(`/blog/${slug}`)).response.status, 404);
      await feeds(false);
      // This real legacy path exists on disk: unpublishing must not fall back to it.
      const existing = await repo.findBySlug('pages', 'cookies', 'en');
      assert.equal(existing.status, 'published');
      try {
        unwrap(await handleContentUnpublish(db, 'pages', existing.id));
        assert.equal((await get('/cookies')).response.status, 404);
      } finally {
        unwrap(await handleContentPublish(db, 'pages', existing.id));
      }
      assert.equal((await get('/cookies')).response.status, 200);
    } finally {
      if (id) {
        await handleContentUnpublish(db, 'posts', id);
        await repo.delete('posts', id);
      }
      await db.destroy();
      await proxy.dispose();
    }
  }
);
