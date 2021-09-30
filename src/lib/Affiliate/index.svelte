<script lang='ts'>
  import { inview } from 'svelte-inview';
  import { inviewOptions } from '$utils/site-data';

  let intersecting: boolean;
</script>

<section
  class='affiliate'
  class:intersecting
  use:inview={inviewOptions}
  on:enter={(event) => {
    const { inView } = event.detail;
    intersecting = inView;
  }}>
  <div class='section-heading sm-left'>
    <h3 class='title-small'>Invite friends and EARN <span class='no-wrap'>$10 USD</span></h3>
    <p class='section-title-lg'>Affiliate</p>
  </div>

  <div class='container'>
    <p class='section-description'>
      Invite your friends and provide them with a $10 USD discount, and receive your part ($10 USD
      as well) the number of invitations unlimited, stack validations forever! Invite 3 friends in a
      row and grab the "Enterprise plan" (20k validations) fully free.
    </p>
    <a rel='external' href='https://app.mailcheck.co/auth/login' title='Invite now' target='_blank'>
      Invite now
    </a>
  </div>
</section>

<style lang='scss'>
  .affiliate {
    @include intersection;

    margin-top: 6rem;
    padding: 0 var(--size-30) var(--size-50);

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

    .no-wrap {
      white-space: nowrap;
    }

    .section-description {
      margin: 0 0 var(--size-40);
      font-weight: var(--weight-300);
      letter-spacing: var(--letter-spacing);
      text-indent: 0;
      color: var(--primary-white);
      text-align: center;
    }

    a {
      border: var(--size-1) solid var(--primary-white);
      border-radius: var(--size-6);
      color: var(--primary-white);
      display: block;
      font-size: var(--size-16);
      font-weight: var(--weight-700);
      height: var(--size-60);
      letter-spacing: var(--letter-spacing);
      line-height: var(--size-60);
      margin: 0 auto;
      max-width: 10rem;
      outline: none;
      padding: 0 var(--size-40);
      text-align: center;
      text-transform: uppercase;
      transition: transform .25s ease;

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

  @media (min-width: 728px) {
    .section-description {
      font-size: var(--size-18);
      line-height: var(--size-28);
      text-align: center;
    }
  }
</style>
