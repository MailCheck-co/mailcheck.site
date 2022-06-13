import mdsvexUrlToImport from './mdsvexplugins/mdsvex-url-to-import.js';
import mdsvexFormatterToImport from './mdsvexplugins/mdsvex-formatter-to-import.js';
import mdsvexGenerateSlug from './mdsvexplugins/mdsvex-generate-slug.js';
import remarkGithub from 'remark-github';
import remarkAbbr from 'remark-abbr';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const config = {
  layout: {
    _: './src/lib/MdLayouts/ArticleLayout.svelte',
    faq: './src/lib/MdLayouts/FaqLayout/FaqLayout.svelte'
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
