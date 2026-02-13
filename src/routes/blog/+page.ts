/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ fetch }) {
  const posts = await fetch('/blog.json').then((res: Response) => res.json());
  return {
    posts
  };
}
