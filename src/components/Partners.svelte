<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/partners";
</style>

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement;
  let intersecting: boolean;
</script>

<IntersectionObserver
  threshold="{0.1}"
  element="{element}"
  bind:intersecting
  once="{true}">
  <section class="partners" bind:this="{element}" class:intersecting>
    <div class="section-heading sm-left">
      <h2 class="title">YOU’RE IN GOOD COMPANY</h2>
      <p class="section-title-lg">PARTNERS</p>
    </div>
    <div class="partners-list">
      <div class="partners-list-item">
        <img
          width="150"
          height="60"
          src="assets/img/testimonials/5k-logo.svg"
          alt="5000 miles"
          class="partners-logo" />
      </div>
      <div class="partners-list-item">
        <img
          width="150"
          height="60"
          src="assets/img/testimonials/bagllet.svg"
          alt="Bagllet"
          class="partners-logo" />
      </div>
      <div class="partners-list-item">
        <img
          width="150"
          height="19"
          src="assets/img/testimonials/acell-mail.svg"
          alt="Acell Mail"
          class="partners-logo" />
      </div>
      <div class="partners-list-item">
        <img
          width="150"
          height="60"
          src="assets/img/testimonials/sammy-logo.svg"
          alt="Sammy-logo"
          class="partners-logo" />
      </div>
      <div class="partners-list-item">
        <img
          width="150"
          height="60"
          src="assets/img/testimonials/zitkani.svg"
          alt="Zitkani"
          class="partners-logo" />
      </div>
    </div>
  </section>
</IntersectionObserver>
