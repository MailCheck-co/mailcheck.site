<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld.js';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Seo
  title="MailCheck Promotion"
  noindex={true}
  description={'MailCheck promotion'}
  schemas={[websiteSchema]}
  canonical="/"
/>
{@render children?.()}
