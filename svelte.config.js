/* eslint-env node */
const sveltePreprocess = require("svelte-preprocess");
const adapter = require('@sveltejs/adapter-static');
const { mdsvex } = require("mdsvex");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const svelteOptions = {
  extensions: [".svelte", ".svx"],
  compilerOptions: {
    immutable: true,
  },
  kit: {
    adapter: adapter({
      pages: 'build',
			assets: 'build',
			fallback: null,
		})
  }, 
  preprocess: [
    sveltePreprocess({
      scss: {
        includePaths: ["src"],
      },
      sourceMap: dev,
      postcss: {
        plugins: [require("autoprefixer")()],
      },
      defaults: {
        style: "scss",
        script: "typescript",
      },
    }),
    mdsvex({
      layout: {
        blog: "./src/layouts/blog.svelte",
        article: "./src/routes/_layout.svelte",
        _: "./src/routes/_layout.svelte",
      },
    }),
  ],
};

module.exports = svelteOptions;
