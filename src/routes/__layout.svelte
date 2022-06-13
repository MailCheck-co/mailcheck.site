<script lang="ts">
  import Header from '$lib/Header/index.svelte';
  import Footer from '$lib/Footer/index.svelte';
  import '../app.scss';
  import "@fontsource/fira-mono";
  import "@fontsource/roboto";
</script>

<Header />

<slot />

<Footer />
