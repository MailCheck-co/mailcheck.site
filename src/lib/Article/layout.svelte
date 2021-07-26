<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import ContactUs from '$lib/ContactUs/index.svelte';
  import { websiteSchema, articleSchema } from '$utils/json-ld';
  import filter from '$lib/Faq/filter.png';

  export let title = '';
  export let slug = '';
  export let canonical = '';
  export let noindex = false;
</script>

<Seo
  {title}
  desc={title}
  isPost={true}
  {canonical}
  {noindex}
  schemas={[websiteSchema, articleSchema]} />

{#if slug == 'faq'}
  <div class="wrapper-questions">
    <div class="section-heading sm-left">
      <h1 class="title">{title}</h1>
      <p class="section-title-lg">{title}</p>
    </div>
    <div class="accordion">
      <slot />
    </div>
    <img class="filter-img" src={filter} width="444" height="568" alt="filter" />
  </div>
{:else}
  <div class="container" id="article">
    <div class="content-block">
      <slot />
    </div>
  </div>
{/if}

<ContactUs />

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
    padding: 0 0 0 var(--size-24);
    line-height: 1.5;
  }

  :global(.container .content-block li) {
    margin: 0 0 0.5em 0;
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

  :global(.wrapper-questions) {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 80rem;
    margin: 0 auto var(--size-50);
    padding: var(--size-50) var(--size-20) 0;
  }

  :global(.section-heading) {
    width: 100%;
  }
  :global(.accordion) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: var(--size-50) var(--size-20) var(--size-50);
  }
  :global(.accordion-column) {
    width: 48%;
  }

  :global(details) {
    position: relative;
    margin-bottom: var(--size-14);
    overflow: hidden;
    border-bottom: var(--size-1) solid var(--dark-02);
    transition: all 0.35s ease-in-out;
  }

  :global(details[open]) {
    height: max-content;
  }

  :global(details > summary) {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 0 var(--size-14) var(--size-14) var(--size-10);
    color: var(--primary-white);
    font-weight: var(--weight-500);
    font-size: var(--size-18);
    line-height: var(--size-28);
    letter-spacing: var(--letter-spacing);
  }

  :global(details > summary::after) {
    position: absolute;
    top: var(--size-10);
    right: var(--size-1);
    display: block;
    width: var(--size-6);
    height: var(--size-6);
    border-bottom: var(--size-1) solid var(--primary-accent);
    border-left: var(--size-1) solid var(--primary-accent);
    transform: rotate(-45deg);
    transition: transform 0.5s ease;
    content: '';
  }

  :global(details[open] > summary::after) {
    transform: rotate(135deg);
  }

  :global(details > summary::-webkit-details-marker) {
    display: none;
  }

  :global(details > p) {
    margin-top: 0;
    padding: 0 var(--size-10);
    color: var(--primary-white);
    font-weight: var(--weight-300);
    font-size: var(--size-16);
    letter-spacing: var(--letter-spacing-text);
    text-align: initial;
    text-indent: initial;
    word-break: break-word;
  }

  :global(details a) {
    color: var(--primary-white);
    font-weight: var(--weight-300);
    font-size: var(--size-16);
    letter-spacing: var(--letter-spacing-text);
    text-align: initial;
    text-decoration: underline;
    text-indent: initial;
    word-break: break-word;
  }

  :global(details a:hover) {
    color: var(--primary-white);
    text-decoration: none;
  }

  :global(details ol) {
    margin: 0;
    padding: 1rem 2.5rem;
  }

  :global(details ul) {
    margin: 0;
    padding: 1rem 2.5rem;
  }

  :global(details li) {
    color: var(--primary-white);
    font-weight: var(--weight-300);
    font-size: var(--size-16);
    letter-spacing: var(--letter-spacing-text);
    text-align: initial;
    text-indent: initial;
    word-break: break-word;
  }
  .filter-img {
    position: absolute;
    top: 6rem;
    right: 0;
    z-index: -1;
    opacity: 0.1;
    pointer-events: none;
  }

  @media only screen and (max-width: 1024px) {
    .wrapper-questions {
      justify-content: center;
      padding: var(--size-50) var(--size-20) 0;
    }
    .accordion {
      flex-direction: column;
      justify-content: start;
      max-width: 80%;
      margin: 0 0 var(--size-50) 0;
      padding: 0 var(--size-10);
    }
    :global(.accordion-column) {
      width: 100%;
    }
    .filter-img {
      order: -1;
      width: 50%;
      min-width: 10%;
      max-width: 70%;
      margin-bottom: var(--size-24);
      transform: translateY(var(--size-50));
    }
  }
  :global(details[open] summary ~ *) {
    animation: sweep 0.5s ease-in-out;
  }
  @keyframes sweep {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
