import { json } from '@sveltejs/kit';
import slugFromBlogPath from '$utils/slugFromBlogPath';

export const prerender = true;

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function GET({ params }) {
  const modules = import.meta.glob('/src/routes/blog/**/*.md');

  let match: [string, () => Promise<unknown>] | undefined;
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromBlogPath(path) === params.slug) {
      match = [path, resolver as () => Promise<unknown>];
      break;
    }
  }

  if (!match) {
    return new Response(undefined, { status: 404 });
  }

  const post = (await match[1]()) as { metadata: unknown };

  return json(post.metadata);
}
