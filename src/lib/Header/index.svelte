<script lang="ts">
  import ToTop from '$lib/ToTop/index.svelte';
  import logo from '$lib/Header/mailcheck-logo.svg';

  /*MOBILE MENU*/
  let open = $state(false);
  let isActive = $state(false);

  function toggleSubMenu() {
    isActive = !isActive;
  }
</script>

<ToTop />

<header>
  <div class="wrapper-header">
    <a class="logo" href="/" aria-label="logo">
      <img src={logo} width="138" height="26" alt="mailcheck logo" />
    </a>
    <div class="header-navigation">
      <nav class="header-nav">
        <a class="nav-link" aria-label="features" href="/#features">Features</a>
        <a class="nav-link" aria-label="pricing" href="/#pricing">Pricing</a>
        <a class="nav-link" aria-label="contact us" href="/#contact-us">Contact Us</a>
        <div class="sub-nav">
          <button class="nav-link nav-btn-not">Case Studies <span class="drop-arrow"></span></button
          >
          <div class="sub-nav-inner">
            <div class="pre-flex">
              <div class="sub-nav-flex">
                <a
                  class="header-sub-link"
                  aria-label="King Billy × Mailcheck"
                  href="/case-studies/king-billy-4x-deposit-conversion"
                >
                  <div class="header-sub-link-inner">
                    <div class="sub-link-avatar">KB</div>
                    <div class="sub-link-data">
                      <p class="name">King Billy × Mailcheck</p>
                      <p class="sub-name">4× Deposit Conversions</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <a class="nav-link" aria-label="blog" href="/blog">Blog</a>
        <a class="nav-link" aria-label="faq" href="/faq">FAQ</a>
      </nav>
      <div>
        <a
          href="https://calendly.com/fm--29/15min"
          rel="external nofollow"
          aria-label="Request a demo"
          target="_blank"
          class="btn btn-start btn-request">Request a demo</a
        >
        <a
          rel="external"
          target="_blank"
          href="https://app.mailcheck.co/"
          class="btn btn-sign-in"
          aria-label="sign in"
        >
          sign in
        </a>
      </div>
    </div>
  </div>
</header>

<!--Mobile menu-->
<button
  class="burger-wrapper"
  class:open
  onclick={() => (open = !open)}
  id="burger"
  aria-label="Toggle menu"
>
  <span class="burger"></span>
</button>
<nav class="mobile-menu" class:open id="mobile-menu">
  <a
    class="nav-link mobile-menu-links"
    onclick={() => (open = !open)}
    aria-label="features"
    href="/#features">Features</a
  >
  <a class="nav-link mobile-menu-links" aria-label="pricing" href="/#pricing">Pricing</a>
  <a class="nav-link mobile-menu-links" aria-label="contact us" href="/#contact-us">Contact Us</a>
  <div class="sub-mobile">
    <button
      class="nav-link mobile-menu-links"
      class:active={isActive}
      onclick={toggleSubMenu}
      aria-expanded={isActive}
    >
      Case Studies
      <span class="drop-arrow"></span>
    </button>
    <div class="sub-mobile-links" class:active={isActive}>
      <div class="sub-mobile-links-inner">
        <a
          class="nav-link mobile-menu-links"
          onclick={() => (open = !open)}
          aria-label="King Billy × Mailcheck"
          href="/case-studies/king-billy-4x-deposit-conversion"
          >King Billy × Mailcheck — 4× Deposit Conversions</a
        >
      </div>
    </div>
  </div>
  <a
    class="nav-link mobile-menu-links"
    onclick={() => (open = !open)}
    aria-label="blog"
    href="/blog">Blog</a
  >
  <a class="nav-link mobile-menu-links" onclick={() => (open = !open)} aria-label="faq" href="/faq"
    >FAQ</a
  >
  <a
    rel="external"
    href="https://app.mailcheck.co/"
    target="_blank"
    aria-label="sign in"
    class="btn btn-sign-in mobile-btn">Sign in</a
  >
  <a
    href="https://calendly.com/fm--29/15min"
    rel="external nofollow"
    target="_blank"
    class="btn btn-bordered btn-invert"
    aria-label="Request a demo">Request a demo</a
  >
</nav>

<button
  class="burger-wrapper"
  class:open
  onclick={() => (open = !open)}
  id="burger"
  aria-controls="mobile-menu"
  aria-expanded={open}
  aria-label="Toggle menu"
>
  <span class="burger"></span>
</button>

<style lang="scss">
  .wrapper-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 80rem;
    height: 5.625rem;
    margin: 0 auto;
  }

  .logo {
    width: 8.625rem;
    height: 1.69rem;
  }

  .header-navigation {
    display: flex;
    align-items: center;
  }

  .header-nav {
    display: flex;
    margin-left: auto;
  }

  .btn {
    font-size: var(--size-16);

    & + & {
      margin-left: var(--size-20);
    }
  }

  .btn-start {
    z-index: 1;
    color: var(--primary-white);
    background-color: var(--primary-accent);
    border: none;

    &:hover {
      color: var(--primary-accent);
      text-decoration: none;
      background-color: var(--primary-white);
    }

    &:active {
      color: var(--primary-white);
      background-color: var(--primary-accent);
    }
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

  .btn-bordered {
    border: var(--size-1) solid var(--dark-05);

    &:hover {
      border-color: var(--primary-white);
    }
  }

  .btn-invert {
    color: var(--primary-accent);
    background-color: var(--primary-white);

    &:hover {
      color: var(--primary-white);
      background-color: var(--primary-accent);
    }
  }

  .btn-request {
    padding: var(--size-10) var(--size-20);
    font-size: calc(var(--size-16) - 20%);
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
    padding: var(--size-50) var(--size-30);
  }

  @media only screen and (max-width: 1024px) {
    .wrapper-header {
      justify-content: space-between;

      .header-navigation {
        display: none;
      }

      .btn {
        font-size: var(--size-14);
      }

      .btn-sign-in {
        display: none;
      }

      .logo {
        z-index: 100;
        margin-left: var(--size-30);
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
        padding: var(--size-16);
        font-weight: var(--weight-400);
        font-size: var(--size-16);
        letter-spacing: var(--letter-spacing);
        text-align: left;
      }
    }

    .mobile-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: var(--size-30) 0;
      margin-left: var(--size-16);
    }
    .sub-mobile {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      button {
        border: none;
        outline: none;
        background-color: transparent;
        display: flex;
        align-items: center;
        gap: 8px;
        &.active {
          span {
            scale: -1;
          }
        }
      }
    }
    .sub-mobile-links {
      display: grid;
      grid-template-rows: 0fr;
      overflow: hidden;
      transition: 0.25s;
      &.active {
        grid-template-rows: 1fr;
      }
    }
    .sub-mobile-links-inner {
      min-height: 0;
    }
  }
</style>
