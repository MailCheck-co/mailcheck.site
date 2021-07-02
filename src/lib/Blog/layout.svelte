<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import ContactUs from '$lib/ContactUs/index.svelte';
  import { websiteSchema } from "$utils/json-ld";

  export let title = '';
</script>

<Seo {title} desc={title} isPost={true} schemas={[websiteSchema]} />

<div class="container" id="blog">
  <div class="content-block">
    <slot />
  </div>
</div>

<ContactUs />

<style>
  .container {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 320px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--size-30);
  }

  .content-block {
    display: flex;
    flex-direction: column;
    max-width: var(--size-880);
    margin: 0 auto;
  }

  :global(h1),
  :global(h2),
  :global(h3) {
    color: var(--primary-white) !important;
    font-weight: var(--weight-700);
  }

  :global(h1) :global(a),
  :global(h2) :global(a),
  :global(h3) :global(a) {
    color: inherit !important;
  }

  :global(h1) {
    width: 100%;
    height: auto;
    margin-bottom: var(--size-24);
    font-size: var(--size-36);
    line-height: var(--size-40);
    letter-spacing: 0.1rem;
    text-align: center;
    text-transform: uppercase;
  }

  :global(h2) {
    font-size: var(--size-30);
  }

  :global(h3) {
    font-size: var(--size-24);
  }

  :global(pre) {
    padding: 0.5em;
    overflow-x: auto;
    color: var(--primary-white);
    background-color: var(--color-pre-global-bg);
    border-radius: var(--size-2);
    box-shadow: inset 0.08rem 0.08rem var(--size-6) var(--color-pre-global-shadow);
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
    font-weight: var(--weight-400);
    line-height: 1.5;
    letter-spacing: 0.08rem;
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

  :global(a) {
    color: var(--color-link);
  }

  :global(a:hover) {
    color: var(--color-link-hover);
  }

  :global(a:visited) {
    color: var(--color-visited);
  }

  :global(img) {
    max-width: 100%;
    height: auto;
  }
</style>
