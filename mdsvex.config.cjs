module.exports = {
	extensions: [".svelte.md", ".md", ".svx"],
	layout: {
        blog: "./src/layouts/blog.svelte",
        article: "./src/routes/__layout.svelte",
        _: "./src/routes/__layout.svelte",
	},
	smartypants: {
		dashes: "oldschool",
	},
	// remarkPlugins: [
	// 	[require("remark-github"), {
	// 		// Use your own repository
	// 		repository: "https://github.com/svelte-add/mdsvex.git",
	// 	}],
	// 	require("remark-abbr"),
	// ],
	// rehypePlugins: [
	// 	require("rehype-slug"),
	// 	[require("rehype-autolink-headings"), {
	// 		behavior: "wrap",
	// 	}],
	// ],
};
