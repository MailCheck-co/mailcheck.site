<script>
  import sassb from './sass-b.png';
  import ContactUs from '$lib/ContactUs/index.svelte';

  const promocode = 'SBMailcheck60';

  function copyPromoCode() {
    const type = 'text/plain';
    const blob = new Blob([promocode], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
      () => {
        /* success */
      },
      () => {
        /* failure */
      }
    );
  }
</script>

<main>
  <div class="row">
    <div class="col">
      <h2>GET YOUR 60% OFF DISCOUNT</h2>
      <h1>WELCOME TO MAILCHECK BLACK FRIDAY <span>DEAL</span></h1>
      <p>
        We are giving a <span>60% discount for 1 year</span>, hurry up to catch this moment.
        Mailcheck.co is a subscription-based product. Those who will use this promo code get
        discount for each month during the next 12 months.
      </p>
    </div>
    <div class="col right">
      <img src={sassb} alt="sassb" />
      <div class="field">
        <input
          class="input input-verify"
          type="email"
          name="email"
          id="email"
          placeholder="Email to verify"
          value={promocode}
          disabled
          on:keydown={copyPromoCode}
          on:mousedown={copyPromoCode}
        />
        <button type="button" class="btn-verify-email" on:click={copyPromoCode}>
          Copy Promocode
        </button>
      </div>
    </div>
  </div>
</main>
<ContactUs />

<style lang="scss">
  main {
    --heading-color: #ffffff;
    --promo-color: #9747ff;
    padding: var(--size-30);
    min-height: 31.25rem;

    @media all and (min-width: 992px) {
      padding: var(--size-30) 5.625rem;
    }

    .row {
      z-index: 1;
      position: relative;
      display: flex;
      align-items: center;
      flex-flow: column wrap;
      justify-content: space-between;

      @media all and (min-width: 992px) {
        flex-flow: row wrap;
      }

      .col {
        max-width: 100%;
        width: auto;
        flex: 1 0 auto;
        text-align: center;
        margin-bottom: var(--size-30);

        @media all and (min-width: 992px) {
          max-width: 40%;
          margin-bottom: 0;
          text-align: left;
        }

        &.right {
          img {
            margin-bottom: 2rem;
          }

          .field {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-flow: column wrap;

            @media all and (min-width: 992px) {
              justify-content: flex-end;
              flex-flow: row nowrap;
            }

            .input-verify {
              position: relative;
              min-width: 12rem;
              margin-bottom: var(--size-30);
              padding: var(--size-20) var(--size-46) var(--size-18) var(--size-16);
              background-color: var(--dark-01);
              border-color: var(--transparent);
              border-radius: 0.25rem;

              @media all and (min-width: 992px) {
                margin-bottom: 0;
              }

              &::placeholder {
                color: var(--dark-02);
                font-size: var(--size-16);
                font-style: italic;
                letter-spacing: var(--letter-spacing);
              }

              &:focus {
                font-weight: var(--weight-500);
                background-color: var(--dark-05);
                box-shadow: 0 0 0 var(--size-1) var(--primary-white) inset;
              }
            }

            .btn-verify-email {
              top: var(--size-8);
              right: var(--size-6);
              display: flex;
              align-items: center;
              justify-content: center;
              min-width: 10rem;
              margin-left: 0;
              height: 3.25rem;
              background-color: var(--color-progress);
              border: none;
              border-radius: var(--size-6);
              transition: 0.35s;
              color: var(--primary-white);
              font-weight: var(--weight-700);
              font-size: var(--size-14);
              text-transform: uppercase;

              @media all and (min-width: 600px) {
                margin-left: 1rem;
              }

              &:hover {
                transform: translateX(var(--size-2));
              }
            }
          }
        }
      }
    }
  }

  img {
    width: 100%;
    height: auto;

    @media all and (min-width: 600px) {
      width: 50%;
      min-width: 18.75rem;
    }
  }

  span {
    color: var(--promo-color);
  }
</style>
