<script lang="ts" context="module">
</script>

<script lang="ts">
  import Breadcrumbs from '../components/Breadcrumbs.svelte';
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema, blogSchema } from '$utils/json-ld';
  import type { IPost } from '$utils/types';

  export let posts: IPost[] = [];
  export let page = 1;
  export let totalPages = 1;
  const title = 'Blog about effective email checking & communication';
  const description =
    'Blog about building effective b2b and b2c email communications: guides and templates, trends & best practices, tips & tricks';
  const pageTitle = page === 1 ? title : `Email Marketing Blog — page ${page}`;
</script>

<Seo
  {description}
  title={pageTitle}
  schemas={[websiteSchema, { ...blogSchema, name: pageTitle, description }]}
/>

<main class="blog-page" id="blog">
  <div class="container">
    <div class="content-block">
      <Breadcrumbs
        items={page === 1
          ? [
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' }
            ]
          : [
              { name: 'Home', url: '/' },
              { name: 'Blog', url: '/blog' },
              { name: `Page ${page}`, url: `/blog/${page}` }
            ]}
      />
      <h1 class="title">{pageTitle}</h1>

      {#each posts as post (post.slug)}
        <h2 class="article-title">
          <a class="article-title-link" href="/blog/{post.slug}">{post.title}</a>
        </h2>
        <p class="article-date">Date: {post.date}</p>
        <p class="article-snippet">
          {post.snippet}
          <a
            sveltekit:prefetch
            class="text-thin text-thin-link"
            href="/blog/{post.slug}"
            aria-label={`Read more about ${post.title}`}>[Read more...]</a
          >
        </p>
      {/each}

      {#if totalPages > 1}
        <nav class="pagination" aria-label="Blog pagination">
          {#if page > 1}
            <a class="pagination-link" href={page === 2 ? '/blog' : `/blog/${page - 1}`} rel="prev"
              >← Newer posts</a
            >
          {/if}
          <div class="pagination-pages">
            {#each Array(totalPages) as _, index}
              {@const pageNumber = index + 1}
              {#if pageNumber === page}
                <span class="pagination-current" aria-current="page">{pageNumber}</span>
              {:else}
                <a class="pagination-link" href={pageNumber === 1 ? '/blog' : `/blog/${pageNumber}`}
                  >{pageNumber}</a
                >
              {/if}
            {/each}
          </div>
          {#if page < totalPages}
            <a class="pagination-link" href={`/blog/${page + 1}`} rel="next">Older posts →</a>
          {/if}
        </nav>
      {/if}
    </div>
  </div>
</main>

<style lang="scss">
  .blog-page {
    position: relative;
    z-index: 1;

    .container {
      .content-block {
        .pagination {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--size-16);
          margin-top: var(--size-32);
          padding-top: var(--size-20);
          border-top: 1px solid rgb(255 255 255 / 20%);

          &-pages {
            display: flex;
            gap: var(--size-12);
            align-items: center;
          }

          &-link,
          &-current {
            color: var(--color-link);
            font-size: var(--size-16);
            text-decoration: none;
          }

          &-link:hover {
            text-decoration: underline;
          }

          &-current {
            color: var(--primary-white);
            font-weight: var(--weight-500);
          }
        }

        .article {
          &-title {
            width: 100%;
            height: auto;
            margin: var(--size-20) auto 0;
            color: var(--primary-white);
            font-weight: var(--weight-500);
            font-size: var(--size-24);
            line-height: 30px;
            letter-spacing: 1.6px;
            text-align: left;
            text-transform: uppercase;
            text-decoration: none;

            &-link {
              color: inherit;
              text-decoration: inherit;
            }

            &:hover {
              color: var(--primary-white);
              text-decoration: underline;
            }
          }

          &-date {
            width: 100%;
            margin: 0 0 10px;
            color: var(--primary-white);
            font-weight: var(--weight-300);
            font-size: var(--size-14);
            line-height: var(--size-20);
            letter-spacing: var(--letter-spacing);
            text-align: left;
            opacity: 0.5;
          }

          &-snippet {
            margin: 0 0 15px;
            color: var(--primary-white);
            font-weight: var(--weight-300);
            font-size: var(--size-16);
            line-height: 24px;
            letter-spacing: var(--letter-spacing);
            text-align: left;
            text-indent: initial;

            .text-thin-link {
              color: var(--color-link);
              text-decoration: none;

              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
      }
    }
  }
</style>
