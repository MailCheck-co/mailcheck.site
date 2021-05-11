<style lang="scss" global>
  @import "../scss/styles";
</style>

<script lang="ts">
	import Header from "$lib//Header.svelte";
	import Footer from "$lib/Footer.svelte";
</script>

<Header />

<slot />

<Footer />