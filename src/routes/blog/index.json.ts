import { getPublishedPosts } from './_blog';
export const GET = async () => {
  const body = await getPublishedPosts();
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
};
