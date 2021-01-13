<script>
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

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/main";
</style>

<svelte:head>
    <title>Mailcheck | Verify your real customers in one way</title>
    <!--scripts-->
    <script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.20.5/TweenMax.min.js">
    </script>
    <script
        src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js">
    </script>
    <script
        src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/plugins/animation.gsap.min.js">
    </script>
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
