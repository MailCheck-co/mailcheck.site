import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { parseLegacyDocument } from './prepare-cms-seed.mjs';
import { collectAssetSources } from './cms-assets.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const types = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

export async function prepareCmsMedia() {
  const previous = await readFile(resolve(root, 'seed/media.json'), 'utf8')
    .then(JSON.parse)
    .catch((error) => {
      if (error.code === 'ENOENT') return { assets: {} };
      throw error;
    });
  // One-time legacy rendition inventory stays for safe catalogue cleanup and
  // backwards URL verification. Never generate/register new renditions here.
  const compatibilityRenditions =
    previous.compatibilityRenditions ??
    Object.fromEntries(
      Object.entries(previous.assets).filter(([key]) => !key.endsWith('|original'))
    );
  const variants = new Map();
  const routes = resolve(root, 'src/routes');
  const paths = (await readdir(routes, { recursive: true }))
    .filter((path) => path.endsWith('/index.md'))
    .sort();
  for (const path of paths) {
    const sourcePath = `src/routes/${path}`;
    const raw = await readFile(resolve(root, sourcePath), 'utf8');
    const { metadata, body } = parseLegacyDocument(raw, sourcePath);
    for (const asset of await collectAssetSources(root, sourcePath, metadata, body)) {
      if (asset.missing) continue;
      variants.set(`${asset.source_path}|original`, { asset, variant: 'original' });
    }
  }
  const assets = {};
  const directory = resolve(root, '.emdash/migration-media');
  await mkdir(directory, { recursive: true });
  for (const [key, { asset }] of [...variants].sort(([a], [b]) => a.localeCompare(b))) {
    const original = await readFile(resolve(root, asset.source_path));
    if (hash(original) !== asset.sha256)
      throw new Error(`Asset changed: ${asset.source_path}; regenerate the seed first.`);
    const bytes = original;
    const digest = hash(bytes);
    const extension = extname(asset.source_path).toLowerCase();
    const storageKey = `legacy/${digest}${extension}`;
    const metadata = await sharp(bytes).metadata();
    await writeFile(resolve(directory, `${digest}${extension}`), bytes);
    assets[key] = {
      storageKey,
      url: `/_emdash/api/media/file/${storageKey}`,
      sha256: digest,
      filename: basename(asset.source_path),
      mimeType: types[extension],
      size: bytes.length,
      width: metadata.width,
      height: metadata.height
    };
  }
  await writeFile(
    resolve(root, 'seed/media.json'),
    `${JSON.stringify({ version: 2, assets, compatibilityRenditions }, null, 2)}\n`
  );
  console.log(
    `Prepared ${variants.size} source/variant mappings; ${
      new Set(Object.values(assets).map((a) => a.storageKey)).size
    } unique media objects.`
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await prepareCmsMedia();
