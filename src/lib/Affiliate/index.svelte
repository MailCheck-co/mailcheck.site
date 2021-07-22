<script lang="ts">
  import { inview } from 'svelte-inview';
  import { inviewOptions } from '$utils/site-data';

  let intersecting: boolean;
</script>

<section
  class="affiliate"
  class:intersecting
  use:inview={inviewOptions}
  on:enter={(event) => {
    const { inView } = event.detail;
    intersecting = inView;
  }}>
  <div class="section-heading sm-left">
    <h3 class="title-small">Affiliate Program</h3>
    <p class="section-title-lg">Affiliate</p>
  </div>

  <div class="grid">
    <a rel="external" target="_blank" href="/" title="Become an affiliate">Become an affiliate</a>
    <a
      rel="external"
      href="https://app.mailcheck.co/auth/login"
      title="Refer a friend"
      target="_blank">
      Refer a friend
    </a>
  </div>
</section>

<style lang="scss">
  .affiliate {
    @include intersection;

    margin-top: 6rem;
    padding: 0 30px var(--size-50);

    .section-heading {
      position: relative;

      .title-small {
        width: 100%;
        height: auto;
        margin-bottom: var(--size-24);
        color: var(--primary-white);
        font-weight: var(--weight-700);
        font-size: var(--size-32);
        line-height: var(--size-40);
        letter-spacing: var(--size-2);
        text-align: center;
        text-transform: uppercase;
      }

      .section-title-lg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        margin: 0;
        color: var(--section-titles-color);
        font-weight: var(--weight-700);
        font-size: var(--size-clamped);
        line-height: 0.2;
        letter-spacing: var(--letter-spacing);
        text-align: center;
        text-transform: uppercase;
        pointer-events: none;
      }
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      max-width: var(--size-880);
      margin: 2rem auto 0;
      text-align: center;
      column-gap: 40px;

      a {
        height: var(--size-60);
        padding: 0 var(--size-40);
        color: var(--primary-white);
        font-weight: var(--weight-700);
        font-size: var(--size-16);
        line-height: var(--size-60);
        letter-spacing: var(--letter-spacing);
        text-transform: uppercase;
        border: var(--size-1) solid var(--primary-white);
        border-radius: var(--size-6);
        outline: none;
        transition: transform 0.25s ease;

        &:hover {
          color: var(--primary-accent);
          text-decoration: none;
          background-color: var(--primary-white);
          transform: translateY(var(--size-1-invert));
        }

        &:first-child {
          margin-bottom: var(--size-60);
        }
      }
    }
  }
</style>
