<script lang="ts">
  import Seo from "$lib/Seo.svelte";
  import EmailsVerify from "$lib/EmailsVerify.svelte";
  import Partners from "$lib/Partners.svelte";
  import Features from "$lib/Features.svelte";
  import Choose from "$lib/Choose.svelte";
  import Pricing from "$lib/Pricing.svelte";
  import Reviews from "$lib/Reviews.svelte";
  import Team from "$lib/Team.svelte";
  import Testimonials from "$lib/Testimonials.svelte";
  import Faq from "$lib/Faq.svelte";
  import ContactUs from "$lib/ContactUs.svelte";
  import Cta from "$lib/Cta.svelte";
</script>

<Seo title="Verify your real customers in one way" />
<svelte:head>
</svelte:head>

<main class="manage-customers" role="main" id="main">
  <!-- EMAILS VERIFY -->
  <EmailsVerify />

  <!-- PARTNERS SECTION -->
  <Partners />

  <!--Welcome to the featuress-->
  <Features />

  <!--Choose your audience-->
  <Choose />

  <!--Pricing plans-->
  <Pricing />

  <!-- SECTION REVIEWS -->
  <Reviews />

  <!-- SECTION TEAM -->
  <Team />

  <!-- SECTION TESTIMONIALS -->
  <Testimonials />

  <!--Questions-->
  <Faq />

  <!--Contact Us-->
  <ContactUs />

  <!-- SECTION CTA -->
  <Cta />
</main>
