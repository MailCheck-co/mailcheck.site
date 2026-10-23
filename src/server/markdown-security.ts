import sanitizeHtml from 'sanitize-html';

// Preserve the legacy article/FAQ markup, but do not execute editor-authored
// scripts, event handlers or dangerous URL schemes. Video is rendered by a
// dedicated Svelte component, not arbitrary embeds.
export function sanitizeMarkdown(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'picture', 'source', 'details', 'summary', 's', 'del'],
    allowedAttributes: {
      '*': ['id', 'class'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'srcset', 'sizes', 'alt', 'title', 'width', 'height', 'loading'],
      source: ['srcset', 'sizes', 'type'],
      details: ['open'],
      th: ['colspan', 'rowspan', 'scope'], td: ['colspan', 'rowspan']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false
  });
}
