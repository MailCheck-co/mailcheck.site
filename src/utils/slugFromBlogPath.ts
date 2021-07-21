const slugFromBlogPath = (path: string) =>
  path.match(/([\w-]+)\/index\.(svelte\.md|md|svx)/i)?.[1] ?? null;

export default slugFromBlogPath;
