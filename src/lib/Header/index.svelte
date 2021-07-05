<script lang="ts">
  import ToTop from '$lib/ToTop/index.svelte';
  import logo from '$lib/Header/mailcheck-logo.svg';

  let open = false;
  let lang = 'en';
  const onLangSelect = (e) => {
    const current = e.target.options.selectedIndex;
    switch (+current) {
      case 0:
        lang = 'en';
        break;
      case 1:
        lang = 'es';
        break;
      case 2:
        lang = 'ru';
        break;
      default:
        lang = 'en';
        break;
    }
  };
</script>

<ToTop />

<header role="banner">
  <div class="wrapper-header">
    <a class="logo" href="/" title="logo">
      <img src={logo} width="138" height="26" alt="mailcheck logo" />
    </a>
    <nav class="header-nav" role="navigation">
      <a class="nav-link" title="features" href="/#features">Features</a>
      <a class="nav-link" title="pricing" href="/#pricing">Pricing</a>
      <a class="nav-link" title="contact us" href="/#contact-us">Contact Us</a>
      <a class="nav-link" title="blog" href="/blog">Blog</a>
      <a class="nav-link" title="faq" href="/faq">FAQ</a>
    </nav>
    <div>
      <select class="select" on:blur={onLangSelect}>
        <option value="en">en</option>
        <option value="es">es</option>
        <option value="ru">ru</option>
      </select>
      <a
        rel="external"
        target="_blank"
        href="https://app.mailcheck.co/"
        class="btn btn-sign-in"
        title="sign in">
        sign in
      </a>
    </div>
  </div>
</header>

<!--Mobile menu-->
<button class="burger-wrapper" class:open on:click={() => (open = !open)} id="burger">
  <span class="burger" />
</button>
<nav
  class="mobile-menu"
  class:open
  on:click={() => (open = !open)}
  role="navigation"
  id="mobile-menu">
  <a class="nav-link mobile-menu-links" title="features" href="/#features">Features</a>
  <a class="nav-link mobile-menu-links" title="pricing" href="/#pricing">Pricing</a>
  <a class="nav-link mobile-menu-links" title="contact us" href="/#contact-us">Contact Us</a>
  <a class="nav-link mobile-menu-links" title="blog" href="/blog">Blog</a>
  <a class="nav-link mobile-menu-links" title="faq" href="/faq">FAQ</a>
  <a
    rel="external"
    href="https://app.mailcheck.co/"
    target="_blank"
    title="sign in"
    class="btn btn-sign-in mobile-btn">sign in</a>
</nav>

<style lang="scss">
  %select {
    margin-right: 1.56rem;
    color: var(--primary-white);
    background-color: var(--transparent);
    border: var(--size-1) solid var(--transparent);

    & > option {
      color: var(--black);
      background-color: var(--transparent);

      &:checked {
        background-color: var(--transparent);
      }

      &:not(:checked) {
        background-color: var(--transparent);
      }

      &:hover {
        background-color: var(--transparent);
      }
    }
  }

  header {
    .wrapper-header {
      display: flex;
      align-items: center;
      justify-content: space-around;
      max-width: 80rem;
      height: 5.625rem;
      margin: 0 auto;

      .logo {
        width: 8.625rem;
        height: 1.69rem;
      }

      .header-nav {
        display: flex;
        justify-content: space-between;
      }

      .select {
        @extend %select;
      }

      .btn-sign-in {
        color: var(--primary-white);
        background: var(--transparent);
        border: var(--size-1) solid var(--dark-05);
        outline: none;

        &:hover {
          border-color: var(--primary-white);
        }

        &:active {
          border-color: var(--dark-05);
        }
      }
    }
  }

  .burger-wrapper {
    padding: 0;
    background-color: var(--transparent);
    border: none;
    outline: none;

    &:hover,
    &:focus,
    &:active {
      border: none;
      outline: none;
    }

    .burger {
      display: none;
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }

  @media only screen and (max-width: 768px) {
    header {
      .wrapper-header {
        justify-content: space-between;

        .header-nav {
          display: none;
        }

        .btn-sign-in {
          display: none;
        }

        .logo {
          z-index: 100;
          margin-left: var(--size-30);
        }

        .select {
          display: none;
        }
      }
    }

    .burger-wrapper {
      position: absolute;
      top: var(--size-30);
      right: 0.3125rem;
      z-index: 200;
      display: block;
      width: var(--size-30);
      height: var(--size-30);
      margin-right: var(--size-30);

      .burger {
        position: relative;
        display: block;
        width: var(--size-30);
        height: 0.25rem;
        background: var(--primary-white);
        cursor: pointer;
        transition: all 0.5s ease;

        &::before,
        &::after {
          position: absolute;
          left: 0;
          width: var(--size-30);
          height: 0.25rem;
          background: var(--primary-white);
          transition: all 0.5s ease;
          content: '';
        }

        &::before {
          top: -0.5625rem;
        }

        &::after {
          top: 0.5625rem;
        }
      }

      &.open {
        position: fixed;
        background: var(--transparent);

        .burger {
          background-color: var(--transparent);

          &::after {
            top: 0;
            transform: rotate(-45deg);
          }

          &::before {
            top: 0;
            transform: rotate(45deg);
          }
        }
      }
    }

    .mobile-menu {
      z-index: 100;
      background-image: var(--mob-menu-gradient);
      transition: all 1s ease;

      &.open {
        left: 0;
      }

      &-links {
        margin: 0 var(--size-50) var(--size-36);
        font-weight: var(--weight-400);
        font-size: var(--size-16);
        letter-spacing: var(--letter-spacing);
        text-align: left;

        &:first-child {
          margin-top: 4.375rem;
        }
      }
    }

    .mobile-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0 var(--size-50) 2.8rem;
    }
  }
</style>
