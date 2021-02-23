/* eslint-env node */
import  sveltePreprocess from "svelte-preprocess";
import  { mdsvex } from "mdsvex";

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const svelteOptions = {
  extensions: [".svelte", ".svx"],
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
      },
    }),
    mdsvex({
      layout: {
          blog: "./src/layouts/blog.svelte",
          article: "./src/routes/_layout.svelte",
          _: "./src/routes/_layout.svelte"
      }
  })
  ],
};

export default svelteOptions;
