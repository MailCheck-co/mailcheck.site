import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { posix, resolve } from 'node:path';

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function collectAssetSources(projectRoot, sourcePath, metadata, body) {
  const references = [...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)].map(
    (match) => match[1]
  );
  if (metadata.thumbnailImg) references.push(metadata.thumbnailImg);

  const assetSources = [];
  for (const reference of [...new Set(references)].sort()) {
    if (/^(?:https?:|data:|\/)/.test(reference)) continue;
    const assetPath = posix.normalize(
      posix.join(posix.dirname(sourcePath), reference.split('?')[0])
    );
    if (!assetPath.startsWith('src/routes/'))
      throw new Error(`Asset escapes routes: ${sourcePath}`);
    try {
      const bytes = await readFile(resolve(projectRoot, assetPath));
      assetSources.push({ reference, source_path: assetPath, sha256: sha256(bytes) });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      // Preserve broken legacy references for review; do not fabricate files.
      assetSources.push({ reference, source_path: assetPath, missing: true });
    }
  }
  return assetSources;
}
