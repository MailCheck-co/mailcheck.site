<style lang="scss">
  @import "../scss/utilities/index";

  .affiliate {
    padding: 120px 0 60px;
    max-width: 880px;
    margin: 0 auto;

    .title-small {
      width: 100%;
      color: $primary-white;
      font-weight: 600;
      font-size: 32px;
      line-height: 48px;
      letter-spacing: 1.6px;
      text-align: center;
      text-transform: uppercase;

      &::before {
        position: absolute;
        right: 0;
        left: 0;
        z-index: 0;
        display: block;
        width: 1024px;
        height: 170px;
        margin: 0 auto;
        color: $section-titles-color;
        font-weight: 900;
        font-size: 160px;
        text-transform: uppercase;
        content: "affiliate";
      }
    }

    .flex {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      flex-direction: column;
      margin-top: 8rem;

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

<script lang="ts">
</script>

<section class="affiliate">
  <h3 class="title-small">Affiliate Program</h3>
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
