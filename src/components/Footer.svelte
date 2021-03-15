<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/footer";
</style>

<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-logo-copyright">
        <a sapper:prefetch class="logo2" href="/"
          ><img
            src="assets/img/mailcheck-logo.svg"
            width="162"
            height="27"
            alt="logo2" /></a>
        <address class="footer-address">
          Suite 4005 43 Bedford Street,<br />
          London, England, WC2E 9HA
        </address>
      </div>
      <nav class="footer-nav" role="navigation">
        <a sapper:prefetch class="nav-link footer-nav-link" href="/#features"
          >Features</a>
        <a sapper:prefetch class="nav-link footer-nav-link" href="/#pricing"
          >Pricing</a>
        <a sapper:prefetch class="nav-link footer-nav-link" href="/#contact-us"
          >Contact Us</a>
        <a sapper:prefetch class="nav-link footer-nav-link" href="/blog"
          >Blog</a>
        <a
          class="nav-link footer-nav-link"
          href="https://app.mailcheck.co/docs#tag--email"
          target="_blank">API</a>
        <a sapper:prefetch class="nav-link footer-nav-link" href="/privacy"
          >Privacy policy</a>
        <a sapper:prefetch class="nav-link footer-nav-link" href="/terms"
          >Terms and conditions</a>
        <a sapper:prefetch class="nav-link footer-nav-link" href="/cookies"
          >Cookie policy</a>
        <a 
          target="_blank"
          class="nav-link footer-nav-link" 
          href="//nodeart.io">Product of NodeArt</a>
      </nav>
      <div class="footer-social-mobile">
        <a
          href="https://www.facebook.com/mailcheck.co/"
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
          class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src="/assets/img/icon-linkedin.svg"
            alt="LinkedIn" />
        </a>
        <a href="https://twitter.com/mailcheckco" class="footer-social-link">
          <img
            width="18"
            height="18"
            class="footer-social-icon"
            src="/assets/img/icon-twitter.svg"
            alt="Twitter" />
        </a>
        <a href="https://github.com/MailCheck-co" class="footer-social-link">
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
          <img class="footer-info-logo" src="/assets/img/es-logo.svg" alt="" />
          <p class="footer-info-text">
            GDPR Compliant<br />
            We will never share your data.
          </p>
        </div>
        <div class="footer-info-item">
          <img
            class="footer-info-logo"
            src="/assets/img/icon-money-back.svg"
            alt="" />
          <p class="footer-info-text">
            40 days<br />
            money-back guarantee
          </p>
        </div>
      </div>
      <div class="footer-info right">
        <span class="copyright2"
          >&#x24B8; 2017-{new Date().getUTCFullYear()} Mailcheck</span>
        <div class="footer-social">
          <a
            href="https://www.facebook.com/mailcheck.co/"
            target="_blank"
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
