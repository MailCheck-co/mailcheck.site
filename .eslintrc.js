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
	},
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	plugins: ["svelte3", "@typescript-eslint", "prettier"],
	overrides: [
		{
			files: ["*.svelte"],
			processor: "svelte3/svelte3",
		},
		{
			files: ["*.ts", "*.json"],
			extends: [
        "plugin:@typescript-eslint/recommended", 
			],
		},
	],
  rules: {
    "import/first": 0,
    "import/no-duplicates": 0,
    "import/no-mutable-exports": 0,
    "import/no-unresolved": 0,
		'@typescript-eslint/no-var-requires': 0, // fix on require method
  },
	settings: {
		"svelte3/preprocess": eslintSveltePreprocess(svelteConfigPath),
		//"svelte3/preprocess": eslintSveltePreprocess(),
		'svelte3/ignore-styles': false
	},
};