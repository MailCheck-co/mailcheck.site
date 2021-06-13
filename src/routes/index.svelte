<script lang="ts">
  import Seo from '$lib/Seo/index.svelte';
  import EmailsVerify from '$lib/EmailsVerify/index.svelte';
  import Partners from '$lib/Partners/index.svelte';
  import Features from '$lib/Features/index.svelte';
  import Choose from '$lib/Choose/index.svelte';
  import Pricing from '$lib/Pricing/index.svelte';
  import Reviews from '$lib/Reviews/index.svelte';
  import Team from '$lib/Team/index.svelte';
  import Testimonials from '$lib/Testimonials/index.svelte';
  import Faq from '$lib/Faq/index.svelte';
  import ContactUs from '$lib/ContactUs/index.svelte';
  import Cta from '$lib/Cta/index.svelte';
  import Affiliate from '$lib/Affiliate/index.svelte';
</script>

<Seo title="Verify your real customers in one way" />
<svelte:head>
  <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="RSS Feed for mailcheck.co"
    href="/feed.xml" />
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

  <!-- SECTION AFFILIATES -->
  <Affiliate />

  <!--Questions-->
  <Faq />

  <!--Contact Us-->
  <ContactUs />

  <!-- SECTION CTA -->
  <Cta />
</main>

<style lang="scss">
  .manage-customers {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 730px;
      background: url('/assets/img/lines.svg') no-repeat 0 0;
      background-size: 100% 66%, 654px 740px;
      content: '';
      pointer-events: none;
    }

    &::after {
      @extend .manage-customers, ::before;

      top: 30%;
      transform: scaleX(-1);
    }
  }

  @media only screen and (min-width: 1920px) {
    .manage-customers::before {
      background-position: 0 35%, 1135px 0;
    }
  }

  @media only screen and (min-width: 1200px) and (max-width: 1440px) {
    .manage-customers::before {
      background-position: 0 35%, 780px -var(--size-20);
    }
  }

  @media only screen and (max-width: 1024px) {
    .manage-customers::before {
      background-position: 0 35%, 715px -15px;
    }
  }

  @media only screen and (max-width: 768px) {
    .manage-customers::before {
      margin-top: -100px;
      padding-top: 100px;
      background-position: top 35% left 30%;
      background-size: auto;
    }

    .manage-customers::after {
      display: none;
    }
  }

  @media only screen and (max-width: 480px) {
    .manage-customers::before {
      background-position: center left 35%;
    }
  }

  @media only screen and (max-width: 320px) {
    .manage-customers::before {
      background-position: 100px -65px;
      background-size: 0, 654px 740px;
    }
  }
</style>
