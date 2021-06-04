<script lang="ts">
  import Seo from '../components/Seo.svelte';
  import ContactUs from '../components/ContactUs.svelte';

  export let title = '';
  export let thumbnail = '';
</script>

<Seo title={`Blog | ${title}`} desc={title} {thumbnail} isPost={true} />

<div class="container" id="blog">
  <div class="content-block">
    <slot />
  </div>
</div>

<ContactUs />

<style>
  .container {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 320px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 30px;
  }

  .content-block {
    display: flex;
    flex-direction: column;
    max-width: 880px;
    margin: 0 auto;
  }
</style>
