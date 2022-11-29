<script>
  import sassb from "./sass-b.png"
  import ContactUs from '$lib/ContactUs/index.svelte';

  const promocode = "SBMailcheck60";

</script>
<main>
  <img src={sassb}/>


  <h2>GET YOUR 60% OFF DISCOUNT</h2>
  <h1>WELCOME TO MAILCHECK BLACK FRIDAY <span>DEAL</span></h1>
  <p>We are giving a <span>60% discount for 1 year</span>, hurry up to catch this moment. Mailcheck.co is a
    subscription-based product. Those who will use this promo code get discount for each month during the next 12
    months.
  </p>


  <input
    class="input input-verify"
    type="email"
    name="email"
    id="email"
    placeholder="Email to verify"
    value={promocode}
    on:keydown={()=>{}}
  />
  <button type="button" class="btn-verify-email" on:click={()=>{}}/>


</main>
<ContactUs/>

<style lang="scss">
  main {
    --heading-color: #ffffff;
    --promo-color: #9747ff;
    padding: 30px;
    min-height: 500px;
  }

  img {
    width: 50%;
    min-width: 300px;
  }

  span {
    color: var(--promo-color);
  }

  .input-verify {
    position: relative;
    margin-bottom: var(--size-8);
    padding: var(--size-20) var(--size-46) var(--size-18) var(--size-16);
    background-color: var(--dark-01);
    border-color: var(--transparent);
    border-radius: 0.25rem;

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
    position: absolute;
    top: var(--size-8);
    right: var(--size-6);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--size-38);
    height: var(--size-36);
    background-color: var(--color-progress);
    border: none;
    border-radius: var(--size-6);
    transition: 0.35s;

    &:hover {
      transform: translateX(var(--size-2));
    }
  }
</style>
