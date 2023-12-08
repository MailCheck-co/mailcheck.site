import { visit } from 'unist-util-visit';

// forgive me
const RE_SCRIPT_START =
  /<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/i;

// look for thumbnailImg in formatter part of the markdown
// if it exists we create manual import of image for vite
// and export it to page metadata (that is available in layout)
// that allows to use imagetools plugin for thumbnail generation
export default function formatterToImport() {
  return function transformer(tree, vFile) {
    if (vFile.data.fm?.thumbnailImg) {
      // if all thumbnails will have the same sizes we can set them here, avoiding putting
      // them in markdown formatter
      const scripts = `import thumbnail from "${vFile.data.fm.thumbnailImg}";\n
      metadata.thumbnail=thumbnail;\n`;
      let is_script = false;
      visit(tree, 'html', (node) => {
        if (RE_SCRIPT_START.test(node.value)) {
          is_script = true;
          node.value = node.value.replace(RE_SCRIPT_START, (script) => `${script}\n${scripts}`);
        }
      });

      if (!is_script) {
        tree.children.push({
          type: 'html',
          value: `<script>\n${scripts}</script>`
        });
      }
    }
  };
}
