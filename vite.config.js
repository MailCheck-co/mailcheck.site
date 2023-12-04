import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { imagetools } from 'vite-imagetools';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit(), imagetools({ force: true })],
  resolve: {
    alias: {
      $utils: path.resolve('./src/utils')
    }
  }
};

export default config;
