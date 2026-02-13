import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

const cleanGlobals = (g) => {
  const result = {};
  for (const [key, value] of Object.entries(g)) {
    result[key.trim()] = value;
  }
  return result;
};

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js', '**/*.svelte'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
        ClipboardItem: 'readable'
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte']
      }
    }
  },
  {
    plugins: {
      '@typescript-eslint': ts
    },
    rules: {
      ...ts.configs.recommended.rules
    }
  },
  ...svelte.configs['flat/recommended'],
  {
    rules: {
      'svelte/no-at-html-tags': 'off'
    }
  },
  prettier,
  ...svelte.configs['flat/prettier'],
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tsParser
      }
    }
  },
  {
    ignores: [
      'build/',
      '.svelte-kit/',
      'dist/',
      'node_modules/',
      'functions/',
      'generate-sitemap.js',
      'mdsvex.config.js',
      'postcss.config.cjs',
      'svelte.config.js',
      'vite.config.js'
    ]
  }
];
