<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/cost";
</style>

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement;
  let intersecting: boolean;
  let slider: HTMLElement;
  let active = false;
  let startX: number;
  let scrollLeft: number;
  const SCROLL_SPEED = 1;

  function onMouseDown(e: MouseEvent) {
    active = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  }

  function onMouseUp() {
    active = false;
  }

  function onMouseMove(e: MouseEvent) {
    if (!active) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * SCROLL_SPEED;
    slider.scrollLeft = scrollLeft - walk;
  }
</script>

<IntersectionObserver threshold={0.1} {element} bind:intersecting once={true}>
  <section bind:this={element} class:intersecting id="pricing">
    <div class="section-heading sm-left">
      <h2 class="title">Cost-effective pricing plans</h2>
      <p class="section-title-lg">PRICING</p>
      <p class="section-subtitle">Choose wisely.</p>
    </div>
    <div class="wrapper-cost">
      <ul
        class="cards"
        class:active
        bind:this={slider}
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:mouseleave={onMouseUp}
        on:mousemove={onMouseMove}>
        <li class="card" id="pro">
          <h3 class="title-colored">pro</h3>
          <span class="title lowercase">$10/mo</span>
          <span class="card-features-text">
            1,000 emails to validate included</span>
          <span class="card-features-text"> $0.005/1 mail overage charge</span>
          <a
            href="//app.mailcheck.co/dashboard/payment_plans"
            class="btn btn-choose">choose</a>
        </li>
        <li class="card" id="agency">
          <h3 class="title-colored cyan">agency</h3>
          <span class="title lowercase">$30/mo</span>
          <span class="card-features-text">
            5,000 emails to validate included</span>
          <span class="card-features-text"> $0.004/1 mail overage charge</span>
          <a
            href="//app.mailcheck.co/dashboard/payment_plans"
            class="btn btn-choose btn-cyan">choose</a>
        </li>
        <li class="card" id="enterprise">
          <h3 class="title-colored grey">enterprise</h3>
          <span class="title lowercase">$90/mo</span>
          <span class="card-features-text">
            20,000 emails to validate included</span>
          <span class="card-features-text"> $0.003/1 mail overage charge</span>
          <a
            href="//app.mailcheck.co/dashboard/payment_plans"
            class="btn btn-choose btn-grey">choose</a>
        </li>
        <li class="card" id="custom">
          <h3 class="title-colored red">custom</h3>
          <span class="card-features-text">
            <span class="bold">EPIC</span>
            100,000+ emails to validate included</span>
          <span class="card-features-text">
            <span class="bold">LEGENDARY</span>
            1,000,000,000+ emails to validate included</span>
          <a
            href="//app.mailcheck.co/dashboard/payment_plans"
            class="btn btn-choose btn-red">choose</a>
        </li>
      </ul>
    </div>
  </section>
</IntersectionObserver>
