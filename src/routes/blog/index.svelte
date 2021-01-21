<script context="module" lang="ts">
	export function preload() {
		return this.fetch(`blog.json`).then((r: { json: () => any; }) => r.json()).then((posts: { slug: string; title: string, html: any, date: string, readingTime: string, snippet: any }[]) => {
			return { posts };
		});
	}
</script>

<script lang="ts">
    import ContactUs from "../../components/ContactUs.svelte";
	export let posts: { slug: string; title: string, html: any, date: string, readingTime: string, snippet: any }[];
</script>

<svelte:head>
	<title>Mailcheck | Blog</title>
</svelte:head>

<style>
    .article-title {
        color: #fff;
    }
</style>

<main class="terms" id="blog">
    <div class="container">
        <div class="content-block">
            <h1 class="title">BLOG</h1>

            {#each posts as post}
                <a rel="prefetch" class="article-title" href="blog/{post.slug}">{post.title}</a>
                <p class="article-date">Date: {post.date}</p>
                <p class="article-snippet">{post.snippet}
                    <a class="text-thin text-thin-link" href="blog/{post.slug}">[Read more...]</a>
                </p>
            {/each}

        </div>
    </div>
</main>

<ContactUs/>
