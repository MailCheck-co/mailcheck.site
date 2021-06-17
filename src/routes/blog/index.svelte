<script lang="ts">
  import ContactUs from '$lib/ContactUs/index.svelte';
  import Seo from '$lib/Seo/index.svelte';

  // export let posts: {
  //   slug: string;
  //   title: string;
  //   html: any;
  //   date: string;
  //   readingTime: string;
  //   snippet: any;
  // }[];
  export let desc = 'Blog';
</script>

<!--<Seo {desc} title="Blog" />-->

<main class="terms" id="blog">
  <div class="container">
    <div class="content-block">
      <h1 class="title">BLOG</h1>

      <!-- {#each posts as post}
        <a sapper:prefetch class="article-title" href="blog/{post.slug}"
          >{post.title}</a>
        <p class="article-date">Date: {post.date}</p>
        <p class="article-snippet">
          {post.snippet}
          <a
            sapper:prefetch
            class="text-thin text-thin-link"
            href="blog/{post.slug}">[Read more...]</a>
        </p>
      {/each} -->
    </div>
  </div>
</main>

<ContactUs />

<style lang="scss">
  // .article-title {
  //   color: var(--primary-white);
  // }

  // .article-snippet {
  //   text-indent: initial;
  // }
</style>
