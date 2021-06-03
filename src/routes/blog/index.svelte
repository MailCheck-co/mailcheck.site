<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit';

  // see https://kit.svelte.dev/docs#loading
  export const load: Load = async ({ fetch }) => {
    const res = await fetch('/blog.json');

    if (res.ok) {
      const posts = await res.json();

      return {
        props: {
          posts
          // .sort((a, b) => {
          //   return new Date(a.date.split(".").reverse().toString()) <
          //   new Date(b.date.split(".").reverse().toString())
          //     ? 1
          //     : -1;
          // })
        }
      };
    }

    const { message } = await res.json();

    return {
      error: new Error(message)
    };
  };
</script>

<script lang="ts">
  import ContactUs from '$lib/ContactUs.svelte';

  import Seo from '$lib/Seo.svelte';
  export let posts: {
    slug: string;
    title: string;
    html: any;
    date: string;
    readingTime: string;
    snippet: any;
  }[];
  export let desc = 'Blog';
</script>

<Seo {desc} title="Blog" />

<main class="terms" id="blog">
  <div class="container">
    <div class="content-block">
      <h1 class="title">BLOG</h1>

      {#each posts as post}
        <a sveltekit:prefetch class="article-title" href="/blog/{post.slug}">{post.title}</a>
        <p class="article-date">Date: {post.date}</p>
        <p class="article-snippet">
          {post.snippet}
          <a sveltekit:prefetch class="text-thin text-thin-link" href="/blog/{post.slug}"
            >[Read more...]</a>
        </p>
      {/each}
    </div>
  </div>
</main>

<ContactUs />

<style>
  .article-title {
    color: var(--pure-white);
  }

  .article-snippet {
    text-indent: initial;
  }
</style>
