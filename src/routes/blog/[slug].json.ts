import slugFromBlogPath from '$utils/slugFromBlogPath';

export async function GET({ params }: { params: { slug?: string } }) {
  const modules = import.meta.glob('./*/index.md');

  let match: [string, () => Promise<any>] | undefined;
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromBlogPath(path) === params.slug) {
      match = [path, resolver as () => Promise<any>];
      break;
    }
  }

  if (!match) {
    return new Response(null, { status: 404 });
  }

  const post = await match[1]();

  return new Response(JSON.stringify(post.frontmatter ?? post.metadata ?? {}), { headers: { 'content-type': 'application/json' } });
}
