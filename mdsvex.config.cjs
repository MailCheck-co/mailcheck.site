module.exports = {
  layout: {
    blog: './src/lib/MdLayouts/BlogLayout.svelte',
    article: './src/lib/MdLayouts/ArticleLayout.svelte',
    faq: './src/lib/MdLayouts/FaqLayout/FaqLayout.svelte'
  },
  extensions: ['.svelte.md', '.md', '.svx'],
  smartypants: {
    dashes: 'oldschool'
  },
  remarkPlugins: [
    [
      require('./mdsvex-url-to-import.cjs'),
      require('remark-github'),
      {
        // Use your own repository
        repository: 'https://github.com/svelte-add/mdsvex.git'
      }
    ],
    require('remark-abbr')
  ],
  rehypePlugins: [
    require('rehype-slug'),
    [
      require('rehype-autolink-headings'),
      {
        behavior: 'wrap'
      }
    ]
  ]
};
