import slugFromBlogPath from '$utils/slugFromBlogPath';
import { getCmsPosts, usesCms } from '../../server/cms-content';

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
