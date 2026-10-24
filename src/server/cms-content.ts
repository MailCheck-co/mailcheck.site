import { env } from 'cloudflare:workers';
import { getEmDashEntry } from 'emdash';
import { getLiveCollection } from 'astro:content';
import { getDb } from 'emdash/runtime';
import { cmsDocument, publicPost, sortPosts } from './cms-document';

export const usesCms = () =>
  (env as unknown as Record<string, unknown>).MAILCHECK_CONTENT_SOURCE === 'cms';

export async function getCmsDocument(route: string) {
  const isPost = route.startsWith('blog/');
  const slug = isPost ? route.slice(5) : route;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return { document: null, isPreview: false };
  const result = await getEmDashEntry(isPost ? 'posts' : 'pages', slug);
  if (result.error) throw new Error('CMS content is temporarily unavailable');
  return {
    document: result.entry ? cmsDocument(result.entry.data as unknown as Record<string, unknown>, isPost) : null,
    isPreview: result.isPreview
  };
}

async function getPublishedDocuments(type: 'posts' | 'pages') {
  // Feed/listing queries are always public snapshots, even for a logged-in
  // editor. Draft overlays and preview tokens only affect single-entry pages.
  const { entries, error } = await getLiveCollection('_emdash', {
    type,
    status: 'published',
    locale: 'en'
  });
  if (error || !entries) throw new Error('CMS posts are temporarily unavailable');
  // EmDash maps a missing collection table to an empty list. This site never
  // legitimately has zero published posts/pages, so fail loudly (5xx, never
  // edge-cached) instead of serving an empty archive, feed or sitemap.
  if (entries.length === 0) throw new Error(`CMS collection ${type} returned no published entries`);
  // Collection reads don't join SEO in EmDash 1.3, unlike single-entry reads.
  // Hydrate in batches to keep sitemap noindex and listing SEO consistent.
  const db = await getDb();
  const seo = new Map<string, Record<string, unknown>>();
  for (let offset = 0; offset < entries.length; offset += 80) {
    const ids = entries.slice(offset, offset + 80).map((entry) => String(entry.data.id));
    const rows = await db
      .selectFrom('_emdash_seo')
      .selectAll()
      .where('collection', '=', type)
      .where('content_id', 'in', ids)
      .execute();
    for (const row of rows)
      seo.set(row.content_id, {
        title: row.seo_title,
        description: row.seo_description,
        image: row.seo_image,
        canonical: row.seo_canonical,
        noIndex: row.seo_no_index === 1
      });
  }
  return entries
    .map((entry) =>
      cmsDocument({ ...entry.data, seo: seo.get(String(entry.data.id)) }, type === 'posts')
    )
    .filter((document) => document !== null);
}

export async function getCmsPosts() {
  return sortPosts((await getPublishedDocuments('posts')).map(publicPost));
}

export async function getCmsPostPaths() {
  return (await getPublishedDocuments('posts'))
    .filter((document) => document.metadata.noindex !== 'true')
    .map((document) => `/blog/${document.slug}`);
}

export async function getCmsPagePaths() {
  return (await getPublishedDocuments('pages'))
    .filter((document) => document.metadata.noindex !== 'true')
    .map((document) => `/${document.slug}`);
}
