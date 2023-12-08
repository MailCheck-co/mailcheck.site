import { getPublishedPosts } from './_blog';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const body = await getPublishedPosts();
  return { body };
};
