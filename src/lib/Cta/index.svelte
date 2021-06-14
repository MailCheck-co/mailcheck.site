<section class="cta" class:intersecting={true}>
  <div class="container">
    <div class="cta-info">
      <h2 class="cta-text">Verify 10-100 emails for free!</h2>
      <a rel="external" target="_blank" href="https://app.mailcheck.co" class="btn btn-start">GET STARTED</a>
    </div>
  </div>
</section>

<style lang="scss">
  .cta {
    @include intersection;

    padding-bottom: 6.25rem;
    text-align: center;

    &-info {
      position: relative;
      z-index: 1;
      color: var(--primary-white);
    }

    &-text {
      font-weight: var(--weight-900);
      font-size: var(--size-32);
      letter-spacing: 0.05rem;
      text-transform: uppercase;
    }

    .btn-start {
      color: var(--primary-white);
      background-color: var(--primary-accent);
      border: none;

      &:hover {
        color: var(--primary-accent);
        background-color: var(--primary-white);
      }

      &:active {
        color: var(--primary-white);
        background-color: var(--primary-accent);
      }
    }
  }

  @media all and (max-width: 768px) {
    .cta {
      padding-bottom: var(--size-50);

      &-info {
        text-align: center;
      }
    }
  }

  @media all and (max-width: 360px) {
    .cta {
      text-align: left;
    }
  }
</style>
