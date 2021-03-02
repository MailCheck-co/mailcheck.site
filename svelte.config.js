/* eslint-env node */
const sveltePreprocess = require("svelte-preprocess");
const { mdsvex } = require("mdsvex");

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const svelteOptions = {
  extensions: [".svelte", ".svx"],
  compilerOptions: {
    immutable: true,
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
