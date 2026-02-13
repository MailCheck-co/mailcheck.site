const slugFromPath = (path: string): string | null => {
  const match = path.match(/\/blog\/([\w-]+)\/\+page\.(svelte\.md|md|svx)/i);
  if (match) return match[1];

  return path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)?.[1] ?? null;
};

export default slugFromPath;
