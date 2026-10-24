<script lang="ts">
  import type { BreadcrumbItem } from '$utils/json-ld';

  export let items: BreadcrumbItem[] = [];
</script>

{#if items.length > 0}
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
      {#each items as item, index}
        <li>
          {#if index < items.length - 1}
            <a href={item.url}>{item.name}</a>
          {:else}
            <span aria-current="page">{item.name}</span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style lang="scss">
  .breadcrumbs {
    margin: 0 0 var(--size-24);
    color: rgb(255 255 255 / 70%);
    font-size: var(--size-14);
    line-height: var(--size-20);
  }

  ol {
    display: flex;
    flex-wrap: wrap;
    gap: var(--size-8);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li:not(:last-child)::after {
    margin-left: var(--size-8);
    color: rgb(255 255 255 / 45%);
    content: '/';
  }

  a {
    color: var(--color-link);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  [aria-current='page'] {
    color: var(--primary-white);
  }
</style>
