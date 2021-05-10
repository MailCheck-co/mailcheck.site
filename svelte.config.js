/* eslint-env node */
import sveltePreprocess from "svelte-preprocess";
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from "mdsvex";
import { mdsvexConfig } from "./mdsvex.config.js";
import autoprefixer from "autoprefixer";

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
		mdsvex(mdsvexConfig),
		sveltePreprocess({
      scss: {
        includePaths: ["src"],
      },
      sourceMap: dev,
      postcss: {
        plugins: [autoprefixer],
      },
      defaults: {
        style: "scss",
        script: "typescript",
      },
    }),
  ],
};

export default svelteOptions;
