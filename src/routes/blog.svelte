<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    const posts = await fetch('/blog.json').then((res) => res.json());
    return {
      props: {
        posts
      }
    };
  }
</script>

<script lang="ts">
  import ContactUs from '$lib/ContactUs/index.svelte';
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema, articleSchema } from '$utils/json-ld';

  export let posts;
  let desc: string = 'Blog';
</script>

<Seo {desc} title={desc} schemas={[websiteSchema, articleSchema]} />

<main class="terms" id="blog">
  <div class="container">
    <div class="content-block">
      <h1 class="title">{desc}</h1>

      {#each posts as { slug, title, snippet, date }}
        <a class="article-title" href="blog/{slug}">{title}</a>
        <p class="article-date">Date: {date}</p>
        <p class="article-snippet">
          {snippet}
          <a sveltekit:prefetch class="text-thin text-thin-link" href="blog/{slug}"
            >[Read more...]</a>
        </p>
      {/each}
    </div>
  </div>
</main>

<ContactUs />

<style lang="scss">
  .article-title {
    color: var(--primary-white);
  }

  .article-snippet {
    text-indent: initial;
  }
</style>
