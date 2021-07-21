<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/Header/index.svelte';
  import Footer from '$lib/Footer/index.svelte';
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld';
  import filter from './filter.png';
  import '../../app.scss';
  import Accordion from './accordion';

  let accordion: HTMLElement;

  onMount(() => {
    accordion.querySelectorAll('details').forEach((el: HTMLElement) => {
      new Accordion(el);
    });
  });
</script>

<Seo desc="FAQ" title="FAQ" schemas={[websiteSchema]} />

<Header />

<!--Questions-->
<section class="faq-page">
  <div class="wrapper-questions">
    <h1 class="title">FAQ</h1>
    <div class="accordion" bind:this={accordion}>
      <slot />
    </div>
    <img class="filter-img" src={filter} width="444" height="568" alt="filter" />
  </div>
</section>

<Footer footerBg={false} />

<style lang="scss">
  .faq-page {
    .wrapper-questions {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: center;
      z-index: 1;
      max-width: 80rem;
      margin: 0 auto var(--size-50);
      padding: var(--size-50) var(--size-20) 0;

      .accordion {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        margin: var(--size-50) var(--size-20) var(--size-50);

        :global(.accordion-column) {
          width: 48%;
        }

        :global(details) {
          overflow: hidden;
          position: relative;
          margin-bottom: var(--size-14);
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
          color: var(--primary-accent);
          font-weight: var(--weight-300);
          font-size: var(--size-16);
          letter-spacing: var(--letter-spacing-text);
          text-align: initial;
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
      }

      .filter-img {
        position: absolute;
        top: 6rem;
        right: 0;
        z-index: -1;
        opacity: 0.1;
        pointer-events: none;
      }
    }
  }

  @media only screen and (max-width: 1024px) {
    .faq-page {
      .wrapper-questions {
        justify-content: center;
        padding: var(--size-50) var(--size-20) 0;

        .accordion {
          flex-direction: column;
          justify-content: start;
          max-width: 80%;
          margin: 0 0 var(--size-50) 0;
          padding: 0 var(--size-10);

          :global(.accordion-column) {
            width: 100%;
          }
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
    }
  }
</style>
