import { basename, extname } from 'node:path';
import sharp from 'sharp';

const formatters = {
  avif: (image) => image.avif(),
  jpg: (image) => image.jpeg(),
  jpeg: (image) => image.jpeg(),
  png: (image) => image.png(),
  webp: (image) => image.webp()
};

// Legacy Markdown requested width=880 through vite-imagetools. Transform only
// explicit imports so Astro's own image imports and ?url assets stay untouched.
export function legacyImages() {
  let development = false;
  return {
    name: 'mailcheck-legacy-images',
    enforce: 'pre',
    configResolved(config) {
      development = config.command === 'serve';
    },
    async load(id) {
      const [path, query = ''] = id.split('?');
      if (new URLSearchParams(query).get('legacy-width') === '880' && /\.(?:png|jpe?g|webp|gif)$/i.test(path)) {
        this.addWatchFile(path);
        const source = await sharp(path).resize({ width: 880 }).webp().toBuffer();
        if (development) {
          return `export default ${JSON.stringify(`data:image/webp;base64,${source.toString('base64')}`)};`;
        }
        const reference = this.emitFile({
          type: 'asset',
          name: `${basename(path, extname(path))}.webp`,
          source
        });
        return `export default "__VITE_ASSET__${reference}__";`;
      }
      const directives = new URLSearchParams(query);
      if (!path.includes('/src/lib/') || (!directives.has('srcset') && !directives.has('format'))) return null;
      this.addWatchFile(path);

      const metadata = await sharp(path).metadata();
      const requestedWidth = directives.get('w') || directives.get('width');
      const width = Number(requestedWidth || metadata.width);
      const formats = (directives.get('format') || metadata.format).split(';');
      const sources = [];

      for (const format of formats) {
        const formatter = formatters[format];
        if (!formatter) throw new Error(`Unsupported legacy image format: ${format}`);
        let image = sharp(path);
        if (requestedWidth) image = image.resize({ width });
        const source = await formatter(image).toBuffer();
        let url;
        if (development) {
          const mime = format === 'jpg' ? 'jpeg' : format;
          url = `data:image/${mime};base64,${source.toString('base64')}`;
        } else {
          const reference = this.emitFile({
            type: 'asset',
            name: `${basename(path, extname(path))}.${format}`,
            source
          });
          url = `__VITE_ASSET__${reference}__`;
        }
        sources.push(directives.has('srcset') ? `${url} ${width}w` : url);
      }

      return `export default ${JSON.stringify(sources.join(', '))};`;
    }
  };
}
