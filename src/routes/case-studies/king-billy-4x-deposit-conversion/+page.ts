/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const posts = await fetch('/blog.json').then((res) => res.json());
  return {
    posts
  };
}
