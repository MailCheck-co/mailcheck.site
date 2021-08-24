<script>
  export let src = '';
  export let alt = '';
</script>

<img srcset={src} {alt} {...$$restProps} /><slot />
