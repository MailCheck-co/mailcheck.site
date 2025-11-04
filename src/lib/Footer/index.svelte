<script lang="ts">
  import esLogo from '$lib/Footer/assets/es-logo.svg';
  import mailcheckLogo from '$lib/Footer/assets/mailcheck-logo.svg';
  import iconTwitter from '$lib/Footer/assets/icon-twitter.svg';
  import iconFacebook from '$lib/Footer/assets/icon-facebook.svg';
  import iconLinkedin from '$lib/Footer/assets/icon-linkedin.svg';
  import iconGitHub from '$lib/Footer/assets/icon-github.svg';
  import iconYoutube from '$lib/Footer/assets/youtube-light.svg';
  import iconMoneyBack from '$lib/Footer/assets/icon-money-back.svg';
  import iconRSS from '$lib/Footer/assets/rss.svg';

  export let footerBg = true;

  let isActivSub = false;
  function toggleSub() {
    isActivSub = !isActivSub;
  }
</script>

<footer class="footer">
  {#if footerBg}
    <div class="footer-bg" />
  {/if}
  <div class="container">
    <div class="footer-top">
      <div class="footer-logo-copyright">
        <a class="logo2" href="/" aria-label="logo">
          <img src={mailcheckLogo} width="162" height="27" alt="logo2" /></a>
        <address class="footer-address">
          Suite 4005 43 Bedford Street,<br />
          London, England, WC2E 9HA
        </address>
      </div>
      <div class="footer-nav nav-affiliate">
        <a
          rel="external"
          target="_blank"
          class="nav-link footer-nav-link"
          aria-label="Refer a friend"
          href="https://app.mailcheck.co/auth/login">Refer a friend</a>
        <a class="nav-link footer-nav-link" aria-label="For affiliates" href="/affiliates"
          >For affiliates</a>
      </div>

      <nav class="footer-nav">
        <a class="nav-link footer-nav-link" aria-label="features" href="/#features">Features</a>
        <a class="nav-link footer-nav-link" aria-label="pricing" href="/#pricing">Pricing</a>
        <a class="nav-link footer-nav-link" aria-label="contact us" href="/#contact-us"
          >Contact Us</a>
        <div class="sub-menu-footer">
          <button class="nav-link footer-nav-link" class:active={isActivSub} on:click={toggleSub}>
            Case studies <span class="drop-arrow" /></button>
          <div class="sub-menu-footer-drop" class:active={isActivSub}>
            <div class="sub-menu-footer-drop-inner">
              <div class="footer-link-flex">
                <a
                  class="footer-sub-menu-link"
                  aria-label="King Billy × Mailcheck"
                  href="/case-studies/king-billy-4x-deposit-conversion#king-billy-4x-deposit-conversion">
                  <div class="link-avatar">KB</div>
                  <div class="link-data">
                    <p>King Billy × Mailcheck</p>
                    <p class="sub">4× Deposit Conversions</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <a class="nav-link footer-nav-link" aria-label="blog" href="/#blog">Blog</a>
        <a
          class="nav-link footer-nav-link"
          href="/l/docs#tag--email"
          rel="external"
          aria-label="API"
          target="_blank">API</a>
        <a class="nav-link footer-nav-link" aria-label="Privacy policy" href="/privacy"
          >Privacy policy</a>
        <a class="nav-link footer-nav-link" aria-label="Terms and conditions" href="/terms"
          >Terms and conditions</a>
        <a class="nav-link footer-nav-link" aria-label="Cookie policy" href="/cookies"
          >Cookie policy</a>
        <a class="nav-link footer-nav-link" aria-label="Video tutorials" href="/videos"
          >Video tutorials</a>
        <a
          rel="external"
          target="_blank"
          aria-label="Product of NodeArt"
          class="nav-link footer-nav-link"
          href="/l/na">Product of NodeArt</a>
      </nav>
      <div class="footer-social-mobile">
        <a
          href="/l/fb"
          target="_blank"
          rel="external"
          aria-label="Facebook page"
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src={iconFacebook}
            alt="Facebook" />
        </a>
        <a
          href="/l/linkedin"
          target="_blank"
          rel="external"
          aria-label="LinkedIn page"
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src={iconLinkedin}
            alt="LinkedIn" />
        </a>
        <a
          href="/l/yt"
          target="_blank"
          rel="external"
          aria-label="Youtube channel"
          class="footer-social-link">
          <img width="18" height="18" class="footer-social-icon" src={iconYoutube} alt="Youtube" />
        </a>
        <a
          href="/l/twitter"
          target="_blank"
          rel="external"
          aria-label="Twitter page"
          class="footer-social-link">
          <img width="18" height="18" class="footer-social-icon" src={iconTwitter} alt="Twitter" />
        </a>
        <a
          href="/l/github"
          target="_blank"
          rel="external"
          aria-label="GitHub page"
          class="footer-social-link">
          <img width="18" height="18" class="footer-social-icon" src={iconGitHub} alt="GitHub" />
        </a>
        <a href="/rss.xml" class="footer-social-link">
          <img width="18" height="18" class="footer-social-icon" src={iconRSS} alt="LinkedIn" />
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-info left">
        <div class="footer-info-item">
          <img class="footer-info-logo" width="36" height="36" src={esLogo} alt="logo" />
          <p class="footer-info-text">
            GDPR Compliant<br />
            We will never share your data.
          </p>
        </div>
        <div class="footer-info-item">
          <img
            class="footer-info-logo"
            width="36"
            height="36"
            src={iconMoneyBack}
            alt="40 days money-back guarantee" />
          <p class="footer-info-text">
            40 days<br />
            money-back guarantee
          </p>
        </div>
      </div>
      <div class="footer-info right">
        <span class="copyright2">&#x24B8; 2017-{new Date().getUTCFullYear()} Mailcheck</span>
        <div class="footer-social">
          <a
            href="/l/fb"
            target="_blank"
            rel="external"
            aria-label="Facebook page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src={iconFacebook}
              alt="Facebook" />
          </a>
          <a
            href="/l/linkedin"
            target="_blank"
            rel="external"
            aria-label="LinkedIn page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src={iconLinkedin}
              alt="LinkedIn" />
          </a>
          <a
            href="/l/yt"
            target="_blank"
            rel="external"
            aria-label="Youtube channel"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src={iconYoutube}
              alt="Youtube" />
          </a>
          <a
            href="/l/twitter"
            target="_blank"
            rel="external"
            aria-label="Twitter page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src={iconTwitter}
              alt="Twitter" />
          </a>
          <a
            href="/l/github"
            target="_blank"
            rel="external"
            aria-label="GitHub page"
            class="footer-social-link">
            <img width="18" height="18" class="footer-social-icon" src={iconGitHub} alt="GitHub" />
          </a>
          <a href="/rss.xml" class="footer-social-link">
            <img width="18" height="18" class="footer-social-icon" src={iconRSS} alt="LinkedIn" />
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

<style lang="scss">
  .footer {
    position: relative;
    padding-top: 6.25rem;
    background: var(--footer-gradient);
  }

  .footer-bg::before {
    position: absolute;
    display: block;
    width: 100%;
    height: 64rem;
    background: url('assets/city-transparent.png') no-repeat center;
    background-size: cover;
    transform: translateY(-105%);
    opacity: 0.4;
    content: '';
    pointer-events: none;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: var(--size-36);
  }

  .footer-logo-copyright {
    display: flex;
    flex-basis: 50%;
    flex-direction: column;
    align-content: center;
  }

  .footer-address {
    max-width: 15.3rem;
    margin-top: var(--size-36);
    color: var(--primary-white);
    font-weight: var(--weight-400);
    font-size: var(--size-14);
    font-style: normal;
    letter-spacing: var(--letter-spacing);
    opacity: 0.5;
  }

  img {
    max-width: fit-content;
  }

  .footer-nav {
    display: flex;
    flex-basis: 33%;
    flex-flow: column wrap;
    align-items: flex-start;
    // max-height: 10.625rem;
    max-height: 13.625rem;
    gap: 0 16px;

    &.nav-affiliate {
      flex-basis: 15%;
    }
  }

  .footer-nav-link {
    margin: 0 0 var(--size-16) 0;

    &:hover {
      text-decoration: none;
    }
  }

  .link-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: rgba(0, 224, 199, 0.16);
    color: var(--accent);
    font-weight: 800;
    font-size: 12px;
  }

  .footer-link-flex {
    display: flex;
    flex-direction: column;
    gap: 8px;
    backdrop-filter: saturate(140%) blur(8px);
    border: 1px solid #ffffff14;
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
    overflow: hidden;
    background-color: #181c24;
  }

  .footer-social-mobile {
    display: none;
  }

  .footer-social-link {
    display: inline-block;
    margin-left: var(--size-16);
  }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-30) 0 var(--size-50);
    border-top: var(--size-2) solid var(--footer-divider-border);
  }

  .footer-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-info-item {
    display: flex;
    align-items: center;
  }

  .footer-info-logo {
    max-width: var(--size-36);
    max-height: var(--size-36);
    margin-right: var(--size-16);
  }

  .footer-info-item + .footer-info-item {
    margin-left: var(--size-46);
  }

  .footer-info-text {
    color: var(--primary-white);
    font-size: var(--size-14);
    text-align-last: left;
    text-indent: initial;
  }

  .footer-social {
    display: flex;
  }

  .copyright2 {
    color: var(--primary-white);
    font-weight: var(--weight-400);
    font-size: var(--size-14);
    letter-spacing: var(--letter-spacing);
    opacity: 0.5;
  }

  .sub-menu-footer {
    position: relative;
    .footer-nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .link-data {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-sub-menu-link {
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: saturate(140%) blur(8px);
    border: 1px solid #2c333b;
    background: rgba(255, 255, 255, 0.02);
    transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
    border-radius: 10px;
    padding: 10px;
    overflow: hidden;
    background-color: #181c24;
    color: var(--primary-white);
    font-weight: var(--weight-300);
    transition: 0.25s;

    p {
      margin: 0;
      color: inherit;
      font-weight: var(--weight-600);
      font-size: 14px;
      text-indent: 0;
      line-height: 1;
      margin-bottom: 2px;
    }
    .sub {
      font-weight: var(--weight-300);
      font-size: 13px;
      color: #9aa7b4;
      margin-bottom: 0;
    }
    @media (hover: hover) {
      &:hover {
        transform: translateY(-2px);
        border-color: rgba(0, 224, 199, 0.35);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
        color: var(--primary-accent);
      }
    }
  }
  .sub-menu-footer-drop {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: 0.25s;
    background-color: var(--black);
    position: absolute;
    left: 0;
    top: 100%;
    white-space: nowrap;
    z-index: 1;
  }

  .sub-menu-footer-drop-inner {
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .sub-menu-footer {
    .nav-link {
      justify-content: flex-start;
      background-color: transparent;
      border: none;
      outline: none;
      padding-left: 0;
      &.active {
        .drop-arrow {
          scale: -1;
        }
      }
      @media (hover: hover) {
        &:hover {
          .drop-arrow {
            scale: -1;
          }
        }
      }
    }
    @media (hover: hover) {
      &:hover {
        .sub-menu-footer-drop {
          grid-template-rows: 1fr;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .footer {
      padding-top: var(--size-50);

      &::before {
        height: 50rem;
        background-position-x: 0;
        transform: translateY(-92%);
      }
    }

    .footer-top,
    .footer-bottom {
      flex-direction: column;
    }

    .footer-nav {
      width: 100%;
      height: 25.625rem;
      margin: 0 0 var(--size-24) 0;
      padding-top: var(--size-40);
    }

    .footer-nav-link {
      margin-right: var(--size-24);
    }

    .footer-logo-copyright {
      padding-bottom: var(--size-30);
      border-bottom: var(--size-2) solid var(--footer-divider-border);
    }

    .footer-bottom {
      align-items: flex-start;
      padding-bottom: var(--size-30);
    }

    .footer-info {
      flex-direction: column;
      align-items: flex-start;
    }

    .footer-info-item + .footer-info-item {
      margin-left: 0;
    }

    .copyright2 {
      padding: var(--size-20) 0;
    }

    .footer-social {
      display: none;
    }

    .footer-social-mobile {
      display: block;
    }
  }

  .sub-menu-footer {
    .sub-menu-footer-drop {
      &.active {
        grid-template-rows: 1fr;
      }
    }
  }
</style>
