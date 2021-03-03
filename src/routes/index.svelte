<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`feed.xml`).then(() => {
      return this.fetch("sitemap.xml");
    });
  }
</script>

<script lang="typescript">
  import Seo from "../components/seo.svelte";
  import EmailsVerify from "../components/EmailsVerify.svelte";
  import Partners from "../components/Partners.svelte";
  import Features from "../components/Features.svelte";
  import Choose from "../components/Choose.svelte";
  import Pricing from "../components/Pricing.svelte";
  import Reviews from "../components/Reviews.svelte";
  import Team from "../components/Team.svelte";
  import Testimonials from "../components/Testimonials.svelte";
  import Faq from "../components/Faq.svelte";
  import ContactUs from "../components/ContactUs.svelte";
  import Cta from "../components/Cta.svelte";
</script>

<Seo title="Verify your real customers in one way" />

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
