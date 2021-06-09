<style lang="scss">
  @import "../scss/utilities/index";

  .affiliate {
    padding: 120px 0 60px;
    transform: matrix(1, 0, 0, 1, 0, 0);
    opacity: 1;

    .section-heading {
      position: relative;
      padding-bottom: 50px;

      .title-small {
        width: 100%;
        color: $primary-white;
        height: auto;
        margin-bottom: 25px;
        font-weight: 600;
        font-size: 32px;
        line-height: 40px;
        letter-spacing: 1.6px;
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
        font-weight: 900;
        font-size: clamp(44px, 14vw, 255px);
        line-height: 0.2;
        letter-spacing: 0.05px;
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
      max-width: 880px;
      margin: 4rem auto 0;

      a {
        height: 60px;
        padding: 0 40px;
        color: #fff;
        background-color: transparent;
        font-weight: 700;
        font-size: 16px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        line-height: 60px;
        border: 1px solid #fff;
        border-radius: 5px;
        outline: none;
        transition: transform 0.25s ease;

        &:hover {
          color: #1bced4;
          background-color: #fff;
          transform: translateY(-1px);
        }

        &:first-child {
          margin-bottom: 60px;
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

<section class="affiliate">
  <div class="section-heading sm-left">
    <h3 class="title-small">affiliate Program</h3>
    <p class="section-title-lg">affiliate</p>
  </div>

  <div class="flex">
    <a href="/" title="Become an affiliate"> Become an affiliate</a>
    <a
      href="https://app.mailcheck.co/auth/login"
      title="Refer a friend"
      target="_blank">
      Refer a friend
    </a>
  </div>
</section>
