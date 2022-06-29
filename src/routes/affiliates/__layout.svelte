<script lang="ts">
  import ContactUs from '$lib/ContactUs/index.svelte';
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld';

  const title = 'Mailcheck affiliate program';
  const desc = title + '. Earn the highest commissions on referrals.';
</script>

<Seo {desc} {title} schemas={[websiteSchema]} />

<slot />

<ContactUs />
