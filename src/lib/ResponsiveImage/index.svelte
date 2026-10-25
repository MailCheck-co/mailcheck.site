<script lang="ts">
  import { imageSources } from './sources.mjs';

  export let srcset = '';
  export let src: string;
  export let alt = '';
  export let sizes: string | undefined = undefined;

  $: sources = imageSources(srcset, src);
</script>

<picture>
  {#if sources.avif}
    <source type="image/avif" srcset={sources.avif} {sizes} />
  {/if}
  {#if sources.webp}
    <source type="image/webp" srcset={sources.webp} {sizes} />
  {/if}
  <img {...$$restProps} src={sources.src} srcset={sources.srcset} {sizes} {alt} />
</picture>

<style>
  picture {
    display: contents;
  }
</style>
