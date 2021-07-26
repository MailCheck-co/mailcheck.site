import { createRequire } from 'module';
const mimicRequire = createRequire(import.meta.url);

export const mdsvexConfig = mimicRequire('./mdsvex.config.cjs');
