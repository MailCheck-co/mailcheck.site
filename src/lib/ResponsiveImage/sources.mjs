/** @typedef {'avif' | 'webp' | 'png' | 'jpeg'} ImageFormat */

/** @param {string} url @returns {ImageFormat | undefined} */
function imageFormat(url) {
  const format =
    /^data:image\/(avif|webp|png|jpe?g)[;,]/i.exec(url)?.[1] ??
    /\.(avif|webp|png|jpe?g)$/i.exec(url.split(/[?#]/)[0])?.[1];
  if (!format) return undefined;
  const normalized = format.toLowerCase().replace('jpg', 'jpeg');
  if (
    normalized === 'avif' ||
    normalized === 'webp' ||
    normalized === 'png' ||
    normalized === 'jpeg'
  ) {
    return normalized;
  }
}

/** @param {string} srcset @param {string} original */
export function imageSources(srcset, original) {
  /** @type {Record<ImageFormat, Array<{url: string, candidate: string}>>} */
  const groups = { avif: [], webp: [], png: [], jpeg: [] };
  // The legacy plugin joins candidates with ", ". Do not split URL commas:
  // development exports data:image/...;base64,... instead of file extensions.
  const candidates = typeof srcset === 'string' ? srcset.split(/,\s+(?=\S)/) : [];

  for (const candidate of candidates) {
    const match = /^(\S+)(?:\s+(.+))?$/.exec(candidate.trim());
    if (!match) continue;
    const [, url, descriptor = ''] = match;
    if (descriptor && !/^(?:[1-9]\d*w|(?:\d+(?:\.\d+)?|\.\d+)x)$/.test(descriptor)) continue;
    const format = imageFormat(url);
    if (format) groups[format].push({ url, candidate: descriptor ? `${url} ${descriptor}` : url });
  }

  const originalUrl = typeof original === 'string' ? original : '';
  const fallbackFormat = imageFormat(originalUrl);
  const fallback =
    fallbackFormat === 'png' || fallbackFormat === 'jpeg'
      ? groups[fallbackFormat]
      : groups.png.length
      ? groups.png
      : groups.jpeg;

  return {
    avif: groups.avif.map(({ candidate }) => candidate).join(', '),
    webp: groups.webp.map(({ candidate }) => candidate).join(', '),
    src: originalUrl || fallback[0]?.url || '',
    srcset: fallback.map(({ candidate }) => candidate).join(', ') || undefined
  };
}
