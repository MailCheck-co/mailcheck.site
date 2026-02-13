<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld';
  import { page } from '$app/state';
  import { dev } from '$app/environment';

  let status = $derived(page.status);
  let error = $derived(page.error);
</script>

<Seo
  title={`${status}`}
  noindex={true}
  description={`Error: ${status}`}
  schemas={[websiteSchema]}
  canonical="/"
/>
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

{#if dev && error && 'stack' in (error as Error)}
  <pre>{(error as Error).stack}</pre>
{/if}
