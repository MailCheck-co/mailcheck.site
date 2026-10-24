<script lang="ts">
  import type { IPost } from '$utils/types';

  export let posts: IPost[] = [];
</script>

{#if posts.length > 0}
  <aside class="related-articles" aria-labelledby="related-articles-title">
    <h2 id="related-articles-title">Related articles</h2>
    <ul>
      {#each posts as post (post.slug)}
        <li>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </li>
      {/each}
    </ul>
  </aside>
{/if}

<style lang="scss">
  .related-articles {
    margin-top: var(--size-40);
    padding-top: var(--size-24);
    border-top: 1px solid rgb(255 255 255 / 20%);
  }

  h2 {
    margin: 0 0 var(--size-16);
    color: var(--primary-white);
    font-size: var(--size-24);
  }

  ul {
    margin: 0;
    padding-left: var(--size-24);
  }

  li {
    margin-bottom: var(--size-8);
  }

  a {
    color: var(--color-link);
  }
</style>
