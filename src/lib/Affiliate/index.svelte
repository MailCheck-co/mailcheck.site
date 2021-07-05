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
    <h3 class="title-small">affiliate Program</h3>
    <p class="section-title-lg">affiliate</p>
  </div>

  <div class="flex">
    <a rel="external" target="_blank" href="/" title="Become an affiliate"> Become an affiliate</a>
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

    padding: 0 0 var(--size-50);

    .section-heading {
      position: relative;

      .title-small {
        width: 100%;
        color: var(--primary-white);
        height: auto;
        margin-bottom: var(--size-24);
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
        color: rgba(17, 50, 78, 0.2);
        font-weight: var(--weight-700);
        font-size: clamp(2.75rem, 14vw, 16rem);
        line-height: 0.2;
        letter-spacing: var(--letter-spacing);
        text-align: center;
        pointer-events: none;
        text-transform: uppercase;
      }
    }

    .flex {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      max-width: var(--size-880);
      margin: 4rem auto 0;

      a {
        height: var(--size-60);
        padding: 0 var(--size-40);
        color: var(--primary-white);
        background-color: transparent;
        font-weight: var(--weight-700);
        font-size: var(--size-16);
        letter-spacing: var(--letter-spacing);
        text-transform: uppercase;
        line-height: var(--size-60);
        border: var(--size-1) solid var(--primary-white);
        border-radius: var(--size-6);
        outline: none;
        transition: transform 0.25s ease;

        &:hover {
          color: var(--primary-accent);
          background-color: var(--primary-white);
          transform: translateY(-var(--size-1));
          text-decoration: none;
        }

        &:first-child {
          margin-bottom: var(--size-60);
        }
      }
    }
  }

  @media (min-width: 768px) {
    .affiliate {
      .flex {
        flex-direction: row;

        a:first-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>
