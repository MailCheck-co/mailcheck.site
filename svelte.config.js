import path from 'path';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';
import { imagetools } from 'vite-imagetools';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    mdsvex(mdsvexConfig),
    preprocess({
      postcss: true,
      scss: {
        prependData: `@import "src/mixins.scss";`
      }
    })
  ],

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    prerender: {
      default: true,
      onError: ({ status, path, referrer, referenceType }) => {
        if (path.startsWith('/l/')) {
          return console.warn(
            `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`
          );
        }
        throw new Error(
          `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`
        );
      }
    },
    trailingSlash: 'never'
  }
};

export default config;
