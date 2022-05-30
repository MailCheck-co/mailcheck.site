<script context="module">
  export const prerender = true;
  export const router = false;
  export const hydrate = false;
</script>

<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld';
</script>

<Seo title="Page not found" noindex={true} desc={"Page not found: 404"} schemas={[websiteSchema]} canonical="/" />
<svelte:head>
  <meta http-equiv="refresh" content="5;https://mailcheck.co/" />
</svelte:head>
<main class="terms" id="terms">
  <div class="container">
    <div class="wrapper-choose">
      <h1 class="title">
        Page not found
      </h1>
      <p class="text-thin art">
        Requested page wasn't found
      </p>
      <p class="text-thin art">You will be redirected to main site in 10 seconds</p>
    </div>
  </div>
</main>

