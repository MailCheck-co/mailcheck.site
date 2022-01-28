<script context="module">
  /** @type {import('@sveltejs/kit').ErrorLoad} */
  export function load({ error, status }) {
    return {
      props: {
        status,
        error
      }
    };
  }
  export const prerender = false;
</script>

<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld';

  export let status;
  export let error;

  const dev = process.env.NODE_ENV === 'development';
</script>

<Seo title={`${status}`} noindex={true} desc={`Error: ${status}`} schemas={[websiteSchema]} canonical="/" />
<svelte:head>
  <meta http-equiv="refresh" content="5;https://mailcheck.co/" />
</svelte:head>
<main class="terms" id="terms">
  <div class="container">
    <div class="wrapper-choose">
      <h1 class="title">
        {#if status}
          Error: {status}
        {:else}
          Page not found
        {/if}
      </h1>
      <p class="text-thin art">
        {#if error && error.message}
          {error.message}
        {:else}
          Requested page wasn't found
        {/if}
      </p>
      <p class="text-thin art">You will be redirected to main site in 10 seconds</p>
    </div>
  </div>
</main>

{#if dev && error && error.stack}
  <pre>{error.stack}</pre>
{/if}
