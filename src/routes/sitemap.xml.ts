 
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
  // On the fly
  // const data = await fetch(import.meta.env.VITE_API_ENDPOINT + '/api/v1/posts?published=t');
  // const posts = await data.json();
  // const body = render(posts.data);

  // Pre-created
  const data = await fetch(import.meta.env.VITE_SITEMAP_URL as string);
  const body = await data.text();

  const headers = {
    'Cache-Control': `max-age=0, s-max-age=${600}`,
    'Content-Type': 'application/xml',
  };
  return {
    body,
    headers,
  };
}
