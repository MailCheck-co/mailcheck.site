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
      import('remark-github'),
      {
        // Use your own repository
        repository: 'https://github.com/svelte-add/mdsvex.git'
      }
    ],
    import('remark-abbr')
  ],
  rehypePlugins: [
    import('rehype-slug'),
    [
      import('rehype-autolink-headings'),
      {
        behavior: 'wrap'
      }
    ]
  ]
};
