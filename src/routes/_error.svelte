<script lang="ts">
  export let status: number;
  export let error: Error;
  import Seo from '../components/Seo.svelte';

  const dev = process.env.NODE_ENV === 'development';
</script>

<Seo title={status.toString()} />
<svelte:head>
  <meta http-equiv="refresh" content="5;https://mailcheck.co/" />
</svelte:head>
<main class="terms" id="terms">
  <div class="container">
    <div class="wrapper-choose">
      <h1 class="title">Error: {status}</h1>
      <p class="text-thin art">{error.message}</p>
      <p class="text-thin art">You will be redirected to main site in 10 seconds</p>
    </div>
  </div>
</main>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
