import slugFromBlogPath from '$utils/slugFromBlogPath';
import { getCmsPosts, usesCms } from '../../server/cms-content';
import type { IPost } from '$utils/types';

export const BLOG_PAGE_SIZE = 10;

export const getPublishedPosts = async () => {
  if (usesCms()) return getCmsPosts();
  const modules = import.meta.glob('./*/index.md');

  const postPromises: Promise<Record<string, any>>[] = [];

  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromBlogPath(path);
    const promise = (resolver as () => Promise<any>)().then((post) => ({
      slug,
      ...(post.frontmatter ?? post.metadata ?? {})
    }));

    postPromises.push(promise);
  }

  const posts = await Promise.all(postPromises);
  const publishedPosts = posts.filter((post) => post.published);

  return publishedPosts.sort((a, b) => {
    return new Date(a.date.split('.').reverse().toString()) <
      new Date(b.date.split('.').reverse().toString())
      ? 1
      : -1;
  });
};

export function paginatePosts<T>(posts: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  const start = (page - 1) * BLOG_PAGE_SIZE;
  return {
    posts: posts.slice(start, start + BLOG_PAGE_SIZE),
    totalPages
  };
}

const stopWords = new Set([
  'about',
  'after',
  'and',
  'for',
  'from',
  'how',
  'the',
  'this',
  'what',
  'with',
  'your'
]);

function keywords(value: string) {
  return new Set(
    value
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((word) => word.length > 3 && !stopWords.has(word)) ?? []
  );
}

export function getRelatedPosts(posts: IPost[], currentSlug: string, limit = 3) {
  const current = posts.find((post) => post.slug === currentSlug);
  if (!current) return posts.slice(0, limit);
  const currentKeywords = keywords(
    [current.title, current.description ?? '', current.snippet].join(' ')
  );

  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post, index) => {
      const candidateKeywords = keywords(
        [post.title, post.description ?? '', post.snippet].join(' ')
      );
      const score = [...candidateKeywords].reduce(
        (total, word) => total + (currentKeywords.has(word) ? 1 : 0),
        0
      );
      return { post, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ post }) => post);
}
