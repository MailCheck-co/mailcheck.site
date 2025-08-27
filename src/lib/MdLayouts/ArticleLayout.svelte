<script context="module" lang="ts">
  import { img } from './components';

  export { img };
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import Seo from '$lib/Seo/index.svelte';
  import Related from '$lib/Related/index.svelte';
  import { websiteSchema, articleSchema } from '$utils/json-ld';
  import data from '$utils/site-data';
  import type { IPost } from '$utils/types';

  export let title = '';
  export let description = '';
  export let canonical = '';
  export let noindex = false;
  export let thumbnail = '';
  export let relatedPosts: IPost[] = [];

  const postsData = [
    {
      title: '5 Marketing Tasks You Must Automate ASAP',
      date: '13.10.2022',
      slug: 'post-1',
      snippet:
        'Marketing automation is on the rise like never before. It involves using different tools to automate repetitive marketing tasks like tracking customer engagement, sending welcome emails, new product launch emails and so on. If you are an emerging marketer looking to optimize your marketing operations, here is an undeniable list of tasks that you need to automate.',
      thumbnail:
        'https://images.unsplash.com/photo-1657127791613-5c65412614d3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      title: '5 Marketing Tasks You Must Automate ASAP',
      date: '13.10.2022',
      slug: 'post-2',
      snippet:
        'Marketing automation is on the rise like never before. It involves using different tools to automate repetitive marketing tasks like tracking customer engagement, sending welcome emails, new product launch emails and so on. If you are an emerging marketer looking to optimize your marketing operations, here is an undeniable list of tasks that you need to automate.',
      thumbnail:
        'https://images.unsplash.com/photo-1657127791613-5c65412614d3?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
      title: "MAXIMIZING YOUR EMAIL MARKETING EFFORTS WITH MAILCHECK.CO'S VALIDATION FEATURES",
      date: '07.07.2023',
      slug: 'maximizing-your-email-marketing-efforts-with-mailcheckcos-validation-features',
      snippet:
        'Email marketing is one of the most effective ways to reach and engage with your audience. However, it can be challenging to ensure that your emails are being delivered to the right people, especially if you have a large email list. That’s where email validation services like Mailcheck.co come in. In this article, we’ll explore the features of Mailcheck.co, an email validation service that can help you improve your email deliverability and increase your ROI.',
      thumbnail: './img1.png?format=jpg&width=880'
    }
  ];
</script>

<Seo
  {title}
  {description}
  isPost={true}
  {canonical}
  {noindex}
  {thumbnail}
  schemas={[
    {
      ...articleSchema,
      image: thumbnail,
      url: data.siteUrl + $page.url.pathname,
      name: title,
      description: description,
      backstory: description,
      headline: title
    },
    websiteSchema
  ]} />

<div class="container" id="article">
  <div class="content-block">
    <slot />
  </div>
  <Related posts={relatedPosts.length ? relatedPosts : postsData} />
</div>

<style lang="scss">
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

  :global(.container .content-block h1) {
    width: 100%;
    height: auto;
    margin-bottom: var(--size-24);
    color: var(--primary-white) !important;
    font-weight: var(--weight-700);
    font-size: var(--size-36);
    line-height: var(--size-40);
    letter-spacing: 0.1rem;
    text-align: center;
    text-transform: uppercase;
  }

  :global(.container .content-block h2) {
    color: var(--primary-white) !important;
    font-weight: var(--weight-700);
    font-size: var(--size-30);
  }

  :global(.container .content-block h3) {
    color: var(--primary-white) !important;
    font-weight: var(--weight-700);
    font-size: var(--size-24);
  }

  :global(.container .content-block pre) {
    padding: 0.5em;
    overflow-x: auto;
    color: var(--primary-white);
    background-color: var(--color-pre-global-bg);
    border-radius: var(--size-2);
    box-shadow: inset var(--size-1) var(--size-1) var(--size-6) var(--color-pre-global-shadow);
  }

  :global(.container .content-block pre code) {
    padding: 0;
    color: var(--primary-white);
    background-color: var(--transparent);
  }

  :global(.container .content-block h1 a) {
    color: var(--primary-white) !important;
    text-decoration: none !important;
  }

  :global(.container .content-block h2 a) {
    color: var(--primary-white) !important;
    text-decoration: none !important;
  }

  :global(.container .content-block h3 a) {
    color: var(--primary-white) !important;
    text-decoration: none !important;
  }

  :global(.container .content-block ul) {
    margin: 0 0 0 var(--size-24);
    padding: 0 0 0 var(--size-24);
    line-height: var(--size-24);
  }

  :global(.container .content-block ol) {
    margin: 0 0 0 var(--size-24);
    padding: 0 0 0 var(--size-24);
    line-height: var(--size-24);
  }

  :global(.container .content-block li) {
    margin: 0 0 0.5em;
    color: var(--primary-white);
  }

  :global(.container .content-block p) {
    color: var(--primary-white) !important;
    font-weight: var(--weight-400);
    line-height: 1.5;
    letter-spacing: var(--letter-spacing);
    text-align: justify;
    text-indent: var(--size-20);
  }

  :global(.container .content-block p img) {
    display: block;
    margin: 0 auto;
  }

  :global(.container .content-block strong) {
    color: var(--primary-white);
    font-weight: var(--weight-700);
  }

  :global(.container .content-block a) {
    color: var(--primary-white);
    text-decoration: underline;
  }

  :global(.container .content-block a:hover) {
    text-decoration: none;
  }

  :global(.container .content-block img) {
    max-width: 100%;
    height: auto;
  }
</style>
