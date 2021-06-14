<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-logo-copyright">
        <a class="logo2" href="/" title="logo">
          <img src="/assets/img/mailcheck-logo.svg" width="162" height="27" alt="logo2" /></a>
        <address class="footer-address">
          Suite 4005 43 Bedford Street,<br />
          London, England, WC2E 9HA
        </address>
      </div>
      <nav class="footer-nav" role="navigation">
        <a class="nav-link footer-nav-link" title="features" href="/#features">Features</a>
        <a class="nav-link footer-nav-link" title="pricing" href="/#pricing">Pricing</a>
        <a class="nav-link footer-nav-link" title="contact us" href="/#contact-us">Contact Us</a>
        <a class="nav-link footer-nav-link" title="blog" href="/blog">Blog</a>
        <a
          class="nav-link footer-nav-link"
          href="https://app.mailcheck.co/docs#tag--email"
          rel="external"
          title="API"
          target="_blank">API</a>
        <a class="nav-link footer-nav-link" title="Privacy policy" href="/privacy">Privacy policy</a>
        <a class="nav-link footer-nav-link" title="Terms and conditions" href="/terms">Terms and conditions</a>
        <a class="nav-link footer-nav-link" title="Cookie policy" href="/cookies">Cookie policy</a>
        <a rel="external" target="_blank" title="Product of NodeArt" class="nav-link footer-nav-link" href="https://nodeart.io"
          >Product of NodeArt</a>
      </nav>
      <div class="footer-social-mobile">
        <a
          href="https://www.facebook.com/mailcheck.co/"
          target="_blank"
          rel="external"
          title="Facebook page"
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src="/assets/img/icon-facebook.svg"
            alt="Facebook" />
        </a>
        <a
          href="https://www.linkedin.com/company/mailcheck/"
          target="_blank"
          rel="external"
          title="LinkedIn page"
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src="/assets/img/icon-linkedin.svg"
            alt="LinkedIn" />
        </a>
        <a
          href="https://twitter.com/mailcheckco"
          target="_blank"
          rel="external"
          title="Twitter page"
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src="/assets/img/icon-twitter.svg"
            alt="Twitter" />
        </a>
        <a
          href="https://github.com/MailCheck-co"
          target="_blank"
          rel="external"
          title="GitHub page"
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src="/assets/img/icon-github.svg"
            alt="GitHub" />
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-info left">
        <div class="footer-info-item">
          <img class="footer-info-logo" src="/assets/img/es-logo.svg" alt="logo" />
          <p class="footer-info-text">
            GDPR Compliant<br />
            We will never share your data.
          </p>
        </div>
        <div class="footer-info-item">
          <img class="footer-info-logo" src="/assets/img/icon-money-back.svg" alt="" />
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
            href="https://www.facebook.com/mailcheck.co/"
            target="_blank"
            rel="external"
            title="Facebook page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src="/assets/img/icon-facebook.svg"
              alt="Facebook" />
          </a>
          <a
            href="https://www.linkedin.com/company/mailcheck//"
            target="_blank"
            rel="external"
            title="LinkedIn page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src="/assets/img/icon-linkedin.svg"
              alt="LinkedIn" />
          </a>
          <a
            href="https://twitter.com/mailcheckco"
            target="_blank"
            rel="external"
            title="Twitter page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src="/assets/img/icon-twitter.svg"
              alt="Twitter" />
          </a>
          <a
            href="https://github.com/MailCheck-co"
            target="_blank"
            rel="external"
            title="GitHub page"
            class="footer-social-link">
            <img
              width="18"
              height="18"
              class="footer-social-icon"
              src="/assets/img/icon-github.svg"
              alt="GitHub" />
          </a>
        </div>
      </div>
    </div>
  </div>
</footer>

<style lang="scss">
  .footer {
    padding-top: 100px;
    position: relative;
    background: linear-gradient(to top, #000 10%, #03091400 100%);
  }

  .footer-address {
    max-width: 245px;
    margin-top: 35px;
    color: var(--primary-white);
    font-weight: var(--weight-400);
    font-size: var(--size-14);
    font-style: normal;
    letter-spacing: 0.8px;
    opacity: 0.5;
  }

  .copyright2 {
    color: var(--primary-white);
    font-weight: var(--weight-400);
    font-size: var(--size-14);
    letter-spacing: 0.8px;
    opacity: 0.5;
  }

  .footer-nav {
    display: flex;
    flex-basis: 50%;
    flex-flow: column wrap;
    align-items: flex-start;
    max-height: 170px;
  }

  .footer-nav-link {
    margin: 0 0var (--size-16) 0;
  }

  .footer-logo-copyright {
    display: flex;
    flex-basis: 50%;
    flex-direction: column;
    align-content: center;

    img {
      max-width: fit-content;
    }
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 35px;
  }

  .footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--size-30) 0 var(--size-50);
    border-top: 2px solid $footer-divider-border;
  }

  .footer-info,
  .footer-social-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .footer-info-item {
    display: flex;
    align-items: center;

    & + & {
      margin-left: 45px;
    }
  }

  .footer-info-logo {
    width: var(--size-36);
    height: var(--size-36);
    margin-right: var(--size-16);
  }

  .footer-info-text {
    color: $white;
    font-size: var(--size-14);
    text-align-last: left;
    text-indent: initial;
  }

  .footer-social {
    display: block;
  }

  .footer-social-mobile {
    display: none;
  }

  .footer-social-link {
    display: inline-block;
    margin-left: var(--size-16);
  }

  @media only screen and (max-width: 768px) {
    .footer {
      padding-top: var(--size-50);
    }
    .footer-top,
    .footer-bottom {
      flex-direction: column;
    }

    .footer-nav {
      width: 100%;
      height: 410px;
      margin: 0 0 25px 0;
      padding-top: var(--size-40);
    }

    .footer-nav-link {
      margin-right: 25px;
    }

    .footer-logo-copyright {
      padding-bottom: var(--size-30);
      border-bottom: 2px solid $footer-divider-border;
    }

    .footer-bottom {
      align-items: start;
      padding-bottom: var(--size-30);
    }

    .footer-info {
      flex-direction: column;
      align-items: start;
    }

    .footer-info-item {
      & + & {
        margin-left: 0;
      }
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
</style>
