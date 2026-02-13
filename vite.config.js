import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import { enhancedImages } from '@sveltejs/enhanced-img';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [enhancedImages(), sveltekit()],
  resolve: {
    alias: {
      $utils: path.resolve('./src/utils')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${path.resolve('./src/mixins.scss')}";`
      }
    }
  }
};

export default config;
