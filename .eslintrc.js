/* eslint-env node */
const eslintSveltePreprocess = require("eslint-svelte3-preprocess");
const path = require("path");
const svelteConfigPath = path.resolve("./svelte.config");

module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    createDefaultProgram: true,
    ecmaVersion: 2020,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    extraFileExtensions: [".svelte"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  plugins: ["svelte3", "@typescript-eslint", "prettier"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
    {
      files: ["*.ts", "*.json"],
      extends: ["plugin:@typescript-eslint/recommended"],
    },
  ],
  rules: {
    "import/first": 0,
    "import/no-duplicates": 0,
    "import/no-mutable-exports": 0,
    "import/no-unresolved": 0,
    "@typescript-eslint/no-var-requires": 0, // fix on require method
    indent: ["error", 2],
  },
  settings: {
    "svelte3/typescript": require("typescript"), // pass the TypeScript package to the Svelte plugin
    "svelte3/preprocess": eslintSveltePreprocess(svelteConfigPath),
    //"svelte3/preprocess": eslintSveltePreprocess(),
    "svelte3/ignore-styles": false,
  },
};
