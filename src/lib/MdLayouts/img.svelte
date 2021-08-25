<script>
  export let src = '';
  export let alt = '';
</script>

<img srcset={src} {alt} loading="lazy" {...$$restProps} /><slot />
