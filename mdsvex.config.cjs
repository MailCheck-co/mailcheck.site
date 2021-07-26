module.exports = {
  layout: {
    blog: './src/lib/Blog/layout.svelte',
    article: './src/lib/Article/layout.svelte'
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
