<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/welcome";
</style>

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement;
  let intersecting: boolean;
</script>

<IntersectionObserver threshold={0.1} {element} bind:intersecting once={true}>
  <section bind:this={element} class:intersecting id="features">
    <div class="section-heading sm-left">
      <h2 class="title">THE FEATURES</h2>
      <p class="section-title-lg">FEATURES</p>
      <p class="section-subtitle">We improve our service everyday</p>
    </div>
    <div class="welcome-flex">
      <img
        class="mail"
        src="assets/img/mail-float.png"
        width="765"
        height="575"
        alt="mail" />
      <ul class="welcome-items">
        <li>
          <span class="digits">01</span>
          <p class="text-thin item">Turn your cold emails into a hot leads</p>
        </li>
        <li>
          <span class="digits">02</span>
          <p class="text-thin item">Validate emails through social networks</p>
        </li>
        <li>
          <span class="digits">03</span>
          <p class="text-thin item">
            Increase your delivery rate up to 5 times with our validation
            algorithm
          </p>
        </li>
        <li>
          <span class="digits">04</span>
          <p class="text-thin item">Spend less on outbound marketing</p>
        </li>
        <li>
          <span class="digits">05</span>
          <p class="text-thin item">Risk-free 40 days money-back guarantee</p>
        </li>
      </ul>
    </div>
  </section>
</IntersectionObserver>
