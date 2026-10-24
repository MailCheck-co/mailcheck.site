import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSeed } from 'emdash/seed';
import { trackingTargetsCollection } from '../configs/tracking-targets-collection.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
export function parseLegacyDocument(raw, sourcePath) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${sourcePath}`);
  const metadata = {};
  for (const line of match[1].split(/\r?\n/).filter(Boolean)) {
    const index = line.indexOf(':');
    if (index < 1 || /^\s/.test(line)) throw new Error(`Unsupported frontmatter: ${sourcePath}`);
    const key = line.slice(0, index).trim();
    if (Object.hasOwn(metadata, key)) throw new Error(`Duplicate ${key}: ${sourcePath}`);
    const value = line.slice(index + 1).trim();
    metadata[key] =
      value === 'true' ? true : value === 'false' ? false : value.replace(/^(['"])(.*)\1$/, '$2');
  }
  if (!metadata.title) throw new Error(`Missing title: ${sourcePath}`);
  return { metadata, body: match[2] };
}

const fields = [
  { slug: 'title', label: 'Title', type: 'string', required: true, searchable: true },
  {
    slug: 'markdown',
    label: 'Legacy Markdown (includes HTML/Svelte syntax)',
    type: 'text',
    required: true
  },
  { slug: 'description', label: 'SEO description', type: 'text' },
  { slug: 'snippet', label: 'Snippet', type: 'text' },
  { slug: 'legacy_date', label: 'Original date (DD.MM.YYYY)', type: 'string' },
  { slug: 'reading_time', label: 'Reading time', type: 'string' },
  { slug: 'noindex', label: 'Exclude from search engines', type: 'boolean' },
  { slug: 'canonical', label: 'Canonical override', type: 'string' },
  { slug: 'thumbnail_source', label: 'Original relative thumbnail reference', type: 'string' },
  { slug: 'source_path', label: 'Repository source', type: 'string', required: true },
  { slug: 'legacy_metadata', label: 'Original typed frontmatter', type: 'json' }
];

export async function createCmsSeed(projectRoot = root) {
  const routes = resolve(projectRoot, 'src/routes');
  const paths = (await readdir(routes, { recursive: true }))
    .filter((path) => path.endsWith('/index.md'))
    .sort();
  const content = { posts: [], pages: [], tracking_targets: [] };
  for (const path of paths) {
    const raw = await readFile(resolve(routes, path), 'utf8');
    const sourcePath = `src/routes/${path}`;
    const { metadata, body } = parseLegacyDocument(raw, sourcePath);
    const isPost = path.startsWith('blog/');
    const route = `/${path.replace(/\/index\.md$/, '')}`;
    const slug = isPost ? route.slice('/blog/'.length) : route.slice(1);
    const collection = isPost ? 'posts' : 'pages';
    content[collection].push({
      id: `${collection}:${slug}`,
      slug,
      status: 'draft',
      data: {
        title: metadata.title,
        markdown: body,
        description: metadata.description ?? '',
        snippet: metadata.snippet ?? '',
        legacy_date: metadata.date ?? '',
        reading_time: metadata.readingTime ?? '',
        noindex: metadata.noindex === true,
        canonical: metadata.canonical ?? '',
        thumbnail_source: metadata.thumbnailImg ?? '',
        source_path: sourcePath,
        legacy_metadata: metadata
      }
    });
  }
  const seed = {
    version: '1',
    defaultLocale: 'en',
    meta: {
      name: 'Mailcheck content',
      description:
        'Markdown draft archive: 50 blog posts and 15 Markdown pages. Public rendering and R2 media migration are not enabled.'
    },
    settings: { title: 'Mailcheck', tagline: 'Email verification and list cleaning' },
    collections: [
      { slug: 'posts', label: 'Blog posts', labelSingular: 'Blog post', sortOrder: 0 },
      { slug: 'pages', label: 'Pages', labelSingular: 'Page', sortOrder: 1 }
    ]
      .map((collection) => ({
        ...collection,
        description: 'Public content. Edit Markdown, preview, then publish.',
        routable: false,
        supports: ['drafts', 'revisions'],
        titleField: 'title',
        fields
      }))
      .concat(trackingTargetsCollection),
    content
  };
  const validation = validateSeed(seed);
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  return seed;
}

export async function prepareCmsSeed({ check = false } = {}) {
  const seed = await createCmsSeed();
  const target = resolve(root, 'seed/seed.json');
  const json = `${JSON.stringify(seed, null, 2)}\n`;
  if (check) {
    if ((await readFile(target, 'utf8')) !== json)
      throw new Error('CMS seed is stale. Run npm run cms:prepare.');
  } else {
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, json);
  }
  console.log(
    `CMS seed ${check ? 'verified' : 'prepared'}: ${seed.content.posts.length} posts, ${
      seed.content.pages.length
    } pages, all drafts.`
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await prepareCmsSeed({ check: process.argv.includes('--check') });
}
