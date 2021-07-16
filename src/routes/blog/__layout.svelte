<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch }) {
    const post = await fetch(`${page.path}.json`).then((res) => res.json());

    if (!post || !post.published) {
      return {
        status: 404,
        error: new Error('Post could not be found')
      };
    }

    return {
      props: {
        post
      }
    };
  }
</script>

<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import ContactUs from '$lib/ContactUs/index.svelte';
  import { websiteSchema, articleSchema } from '$utils/json-ld';

  export let post;
</script>

<Seo
  title={`Blog | ${post.title}`}
  desc={post.title}
  isPost={true}
  schemas={[websiteSchema, articleSchema]} />

<slot />

<ContactUs />

<style>
  :global(.content-block h1),
  :global(.content-block h2),
  :global(.content-block h3) {
    color: var(--primary-white) !important;
    font-weight: var(--weight-600);
    text-align: left;
  }

  :global(.content-block h1) {
    width: 100%;
    height: auto;
    margin-bottom: var(--size-24);
    font-size: var(--size-36);
    line-height: var(--size-40);
    letter-spacing: 0.1rem;
    text-align: center;
    text-transform: uppercase;
  }

  :global(.content-block h2) {
    font-size: var(--size-28);
  }

  :global(.content-block h3) {
    font-size: var(--size-22);
  }

  :global(pre) {
    padding: 0.5em;
    overflow-x: auto;
    color: var(--primary-white);
    background-color: var(--color-pre-global-bg);
    border-radius: var(--size-2);
    box-shadow: inset var(--size-1) var(--size-1) var(--size-6) var(--color-pre-global-shadow);
  }

  :global(pre) :global(code) {
    padding: 0;
    color: var(--primary-white);
    background-color: var(--transparent);
  }

  :global(ul) {
    padding: 0 0 0 var(--size-24);
    line-height: 1.5;
  }

  :global(li) {
    margin: 0 0 0.5em 0;
    color: var(--primary-white);
  }

  :global(p) {
    color: var(--primary-white) !important;
    font-weight: var(--weight-300);
    line-height: 1.5;
    letter-spacing: var(--letter-spacing);
    text-align: justify;
    text-indent: var(--size-20);
  }

  :global(p) :global(img) {
    display: block;
    margin: 0 auto;
  }

  :global(strong) {
    color: var(--primary-white);
    font-weight: var(--weight-700);
  }

  :global(.content-block a) {
    color: var(--color-link);
  }

  :global(.content-block a:hover) {
    text-decoration: underline;
  }

  :global(.content-block h1 a),
  :global(.content-block h2 a),
  :global(.content-block h3 a) {
    color: var(--primary-white);
  }

  :global(img) {
    max-width: 100%;
    height: auto;
  }
</style>
