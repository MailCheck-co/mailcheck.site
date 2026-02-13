import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', ...mdsvexConfig.extensions],
  preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],

  kit: {
    alias: {
      $utils: 'src/utils'
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined
    }),
    prerender: {
      handleHttpError: ({ status, path, referrer, referenceType, message }) => {
        if (path.startsWith('/l/')) {
          console.warn(
            `${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`
          );
          return;
        }
        throw new Error(message);
      },
      handleUnseenRoutes: 'ignore'
    }
  }
};

export default config;
