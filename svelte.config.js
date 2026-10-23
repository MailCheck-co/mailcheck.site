import preprocess from 'svelte-preprocess';

export default {
  preprocess: preprocess({
    postcss: true,
    scss: { prependData: '@import "src/mixins.scss";' }
  }),
  compilerOptions: { compatibility: { componentApi: 4 } }
};
