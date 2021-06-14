<section class="affiliate">
  <div class="section-heading sm-left">
    <h3 class="title-small">affiliate Program</h3>
    <p class="section-title-lg">affiliate</p>
  </div>

  <div class="flex">
    <a href="/" title="Become an affiliate"> Become an affiliate</a>
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
    padding: 7.5rem 0var (--size-60);
    transform: matrix(1, 0, 0, 1, 0, 0);
    opacity: 1;

    .section-heading {
      position: relative;
      padding-bottom: var(--size-50);

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
        letter-spacing: 0.05rem;
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
        padding: var(--size-40);
        color: var(--white);
        background-color: transparent;
        font-weight: var(--weight-700);
        font-size: var(--size-16);
        letter-spacing: 0.08rem;
        text-transform: uppercase;
        line-height: var(--size-60);
        border: 0.08rem solid var(--white);
        border-radius: var(--size-6);
        outline: none;
        transition: transform 0.25s ease;

        &:hover {
          color: var(--primary-accent);
          background-color: var(--white);
          transform: translateY(-0.08rem);
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
