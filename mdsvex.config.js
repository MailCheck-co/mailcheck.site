import mdsvexUrlToImport from './mdsvexplugins/mdsvex-url-to-import.js';
import mdsvexFormatterToImport from './mdsvexplugins/mdsvex-formatter-to-import.js';
import mdsvexGenerateSlug from './mdsvexplugins/mdsvex-generate-slug.js';
import remarkGithub from 'remark-github';
import remarkAbbr from 'remark-abbr';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  layout: {
    _: resolve(__dirname, './src/lib/MdLayouts/ArticleLayout.svelte'),
    faq: resolve(__dirname, './src/lib/MdLayouts/FaqLayout/FaqLayout.svelte')
  },
  extensions: ['.svelte.md', '.md', '.svx'],
  smartypants: {
    dashes: 'oldschool'
  },
  remarkPlugins: [
    mdsvexGenerateSlug,
    mdsvexFormatterToImport,
    mdsvexUrlToImport,
    [
      remarkGithub,
      {
        buildUrl(values, defaultBuildUrl) {
          return values.user === 'example' ? false : defaultBuildUrl(values);
        },
        // Use your own repository
        repository: 'https://github.com/MailCheck-co/mailcheck.site.git'
      }
    ],
    remarkAbbr
  ],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap'
      }
    ]
  ]
};

export default config;
