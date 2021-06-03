<script lang="ts">
  let element: HTMLElement;
  let intersecting: boolean;
</script>

<section class="cta" bind:this={element} class:intersecting>
  <div class="container">
    <div class="cta-info">
      <h2 class="cta-text">Verify 10-100 emails for free!</h2>
      <a href="https://app.mailcheck.co" class="btn btn-start">GET STARTED</a>
    </div>
  </div>
</section>

<style lang="scss">
  @import '../scss/utilities/index';
  @import '../scss/molecules/cta';
</style>
