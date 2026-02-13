import slugFromPath from '$utils/slugFromPath';
import type { IPost } from '$utils/types';

export const getPublishedPosts = async (): Promise<IPost[]> => {
  const modules = import.meta.glob('/**/*.md');

  const postPromises: Promise<IPost>[] = [];

  for (const [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = (resolver() as Promise<{ metadata: IPost }>).then((post) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { slug: _, ...metadata } = post.metadata;
      const rawThumb = metadata.thumbnailImg || metadata.thumbnail;
      return {
        slug,
        ...metadata,
        thumbnail: typeof rawThumb === 'object' && rawThumb ? rawThumb.src : (rawThumb ?? '')
      } as IPost;
    });
    postPromises.push(promise);
  }

  const posts = await Promise.all(postPromises);
  const publishedPosts = posts.filter((post: IPost) => post.published);

  return publishedPosts.sort((a: IPost, b: IPost) => {
    const dateA = new Date(a.date.split('.').reverse().toString()).getTime();
    const dateB = new Date(b.date.split('.').reverse().toString()).getTime();
    return dateB - dateA;
  });
};
