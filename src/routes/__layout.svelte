<style lang="scss" global>
  @import "../scss/styles";
</style>

<script lang="ts">
  import Header from "../components/Header.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<Header />

<slot />

<Footer />
