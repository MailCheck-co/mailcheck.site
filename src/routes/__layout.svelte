<script lang="ts">
  import Header from '$lib/Header/index.svelte';
  import Footer from '$lib/Footer/index.svelte';
  import '../app.scss';
  import '@fontsource/fira-mono/latin.css';
  import '@fontsource/roboto/latin.css';
</script>

<Header />

<slot />

<Footer />
