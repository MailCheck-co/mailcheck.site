<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    const posts = await fetch('/blog.json').then((res: Response) => res.json());
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
  import { websiteSchema, blogSchema } from '$utils/json-ld';
  import type { IPost } from '$utils/types';

  export let posts: IPost[];
  const title = 'Blog about effective email checking & communication';
  const description =
    'Blog about building effective b2b and b2c email communications: guides and templates, trends & best practices, tips & tricks';
</script>

<Seo {description} {title} schemas={[websiteSchema, { ...blogSchema, name: title, description }]} />

<main class="blog-page" id="blog">
  <div class="container">
    <div class="content-block">
      <h1 class="title">{title}</h1>

      {#each posts as post (post.slug)}
        <a class="article-title" href="blog/{post.slug}">{post.title}</a>
        <p class="article-date">Date: {post.date}</p>
        <p class="article-snippet">
          {post.snippet}
          <a sveltekit:prefetch class="text-thin text-thin-link" href="blog/{post.slug}"
            >[Read more...]</a
          >
        </p>
      {/each}
    </div>
  </div>
</main>

<ContactUs />

<style lang="scss">
  .blog-page {
    position: relative;
    z-index: 1;

    .container {
      .content-block {
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
