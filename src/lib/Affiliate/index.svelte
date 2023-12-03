<script lang="ts">
  import { inview } from 'svelte-inview';
  import { inviewOptions } from '$utils/site-data';
  import imgAffiliate from './invite-friends.jpg?w=500&format=webp;png;avif&srcset';

  let intersecting: boolean;
</script>

<section
  class="affiliate"
  class:intersecting
  use:inview={inviewOptions}
  on:enter={(event) => {
    const { inView } = event.detail;
    intersecting = inView;
  }}
>
  <div class="section-heading sm-left">
    <h3 class="title-small">Invite friends and EARN <span class="no-wrap">$10 USD</span></h3>
    <p class="section-title-lg">Affiliate</p>
  </div>

  <div class="container">
    <div class="affiliate-block">
      <div class="affiliate-block-inner">
        <div class="affiliate-block-image">
          <img srcset={imgAffiliate} width="500" class="affiliate-image" alt="Invite friends" />
        </div>
        <div class="affiliate-block-content">
          <p class="section-description">
            "Invite your friends and earn $10 USD in cash or validation if your invited friend
            purchases any of our plans. Your friend will also get a $10 USD discount on their first
            month. It's a win-win for both of you!"
          </p>
          <a
            class="affiliate-btn"
            rel="external"
            href="https://app.mailcheck.co/dashboard/settings"
            title="Invite now"
            target="_blank"
          >
            Invite now
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style lang="scss">
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
      color: var(--primary-white);
      font-weight: var(--weight-300);
      letter-spacing: var(--letter-spacing);
      text-indent: 0;
    }

    .affiliate-block {
      padding: var(--size-20) 0;
    }

    .affiliate-block-image {
      max-width: 50%;
    }

    .affiliate-block-inner {
      display: flex;
      gap: var(--size-40);
      align-items: stretch;
    }

    .affiliate-block-content {
      display: flex;
      flex-direction: column;
      padding: var(--size-30) 0;
    }

    .affiliate-btn {
      display: block;
      max-width: 10rem;
      height: var(--size-60);
      margin-top: auto;
      padding: 0 var(--size-40);
      color: var(--primary-white);
      font-weight: var(--weight-700);
      font-size: var(--size-16);
      line-height: var(--size-60);
      letter-spacing: var(--letter-spacing);
      text-align: center;
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

    @media (min-width: 728px) {
      .section-description {
        font-size: var(--size-18);
        line-height: var(--size-28);
      }
    }

    @media (max-width: 1024px) {
      .affiliate-block-inner {
        flex-direction: column;
        gap: 0;
        text-align: center;
      }

      .affiliate-block-image {
        max-width: 100%;
        margin: 0 auto;
      }

      .affiliate-btn {
        margin: 0 auto;
      }
    }
  }
</style>
