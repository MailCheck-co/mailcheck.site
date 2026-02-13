<script lang="ts">
  interface Props {
    src?: string | import('@sveltejs/enhanced-img').Picture;
    alt?: string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'auto' | 'sync';
    children?: import('svelte').Snippet;
  }

  let { src = '', alt = '', loading = 'lazy', decoding = 'async', children }: Props = $props();
</script>

<enhanced:img {src} {alt} {loading} {decoding} />{@render children?.()}
