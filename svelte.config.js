import path from 'path';
import { mdsvex } from 'mdsvex';
import { mdsvexConfig } from './mdsvex.config.js';
import preprocess from 'svelte-preprocess';
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
      defaults: {
        style: 'scss',
        script: 'typescript'
      },
      scss: {
        prependData: `@import "src/mixins.scss";`
      }
    })
  ],

  kit: {
    target: '#svelte',
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    prerender: {
			force: true
		},
    vite: {
			resolve: {
				alias: {
					$utils: path.resolve('./src/utils')
				}
			}
		}
  }
};

export default config;
