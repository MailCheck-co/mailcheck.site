export interface CmsDocument {
  slug: string;
  directory: string;
  metadata: Record<string, string>;
  content: string;
  hasLegacyThumbnail?: boolean;
}

const text = (value: unknown) => typeof value === 'string' ? value : '';

// Publication is governed by EmDash status, never by the archival legacy flag.
// Only this explicit projection may reach public JSON/RSS (no source backups).
export function cmsDocument(data: Record<string, unknown>, isPost: boolean): CmsDocument | null {
  const slug = text(data.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !text(data.title) || typeof data.markdown !== 'string') return null;
  const route = isPost ? `blog/${slug}` : slug;
  const sourcePath = text(data.source_path);
  const sourceDirectory = /^src\/routes\/(?:[a-z0-9-]+\/)*index\.md$/.test(sourcePath)
    ? sourcePath.replace(/^src\//, '../').replace(/\/index\.md$/, '')
    : `../routes/${route}`;
  const seo = data.seo && typeof data.seo === 'object' ? data.seo as Record<string, unknown> : {};
  return {
    slug,
    directory: sourceDirectory,
    content: data.markdown,
    hasLegacyThumbnail: !!data.legacy_metadata && typeof data.legacy_metadata === 'object' &&
      Object.prototype.hasOwnProperty.call(data.legacy_metadata, 'thumbnailImg'),
    metadata: {
      title: text(seo.title) || text(data.title),
      description: text(seo.description) || text(data.description),
      snippet: text(data.snippet),
      date: text(data.legacy_date),
      readingTime: text(data.reading_time),
      canonical: text(seo.canonical) || text(data.canonical),
      noindex: String(typeof seo.noIndex === 'boolean' ? seo.noIndex : data.noindex === true || data.noindex === 1),
      thumbnailImg: text(seo.image) || text(data.thumbnail_source),
      published: 'true'
    }
  };
}

export function publicPost(document: CmsDocument) {
  const m = document.metadata;
  return { slug: document.slug, published: true, title: m.title, date: m.date,
    readingTime: m.readingTime, snippet: m.snippet, description: m.description,
    ...(m.thumbnailImg ? { thumbnailImg: m.thumbnailImg } : document.hasLegacyThumbnail ? { thumbnailImg: null } : {}) };
}

export function sortPosts<T extends { slug: string; date: string }>(posts: T[]): T[] {
  const date = (value: string) => {
    const [day, month, year] = value.split('.');
    return Date.parse(`${year}-${month}-${day}`) || 0;
  };
  // The legacy sorter put equal-date entries in reverse folder order.
  return posts.sort((a, b) => date(b.date) - date(a.date) || b.slug.localeCompare(a.slug));
}

export function escapeXml(value: string): string {
  return value.replace(/[<>&"']/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
}
