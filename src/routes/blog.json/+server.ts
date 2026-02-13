import { json } from '@sveltejs/kit';

import { getPublishedPosts } from '../blog/_blog';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

export const GET: RequestHandler = async () => {
  const body = await getPublishedPosts();
  return json(body);
};
