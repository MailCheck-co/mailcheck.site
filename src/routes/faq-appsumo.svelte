<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/frequent-questions";
</style>

<script lang="typescript">
  import Seo from "../components/Seo.svelte";
  import ContactUs from "../components/ContactUs.svelte";
</script>

<Seo title="FAQ AppSumo" canonical="/faq" />

<!--Questions-->
<section id="faq-appsumo" class="frequent-questions faq-page">
  <div class="wrapper-questions">
    <h3 class="title-small">FAQ AppSumo</h3>

    <div class="accordion">
      <div class="accordion-column">
        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >What's the difference between the Mailcheck and previous competitor
            offers?</span>
          <div class="tab-content">
            <p class="tab-text">
              Mailcheck provides the highest amount of the email validations
              AppSumo ever had, with 100,000 credits monthly limit. Currently,
              we allow Sumolings to verify 2M credits lifetime.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >I got a CMS built website is there a way to use your service?</span>
          <div class="tab-content">
            <p class="tab-text">
              We have several solutions,

              <br />
              <br />
              1) If you are using WordPress, you can
              <a
                target="_blank"
                href="https://wordpress.org/plugins/mailcheck-co/">
                install our plugin
              </a>
              and set it up on your website, we're constantly updating our code,
              so you can fully rely on us.

              <br />
              <br />
              2) Use our API to simply copy and paste
              <a
                target="_blank"
                href="https://app.mailcheck.co/docs#tag--email">
                within the website</a>
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >I've bought several codes, how can I use them at a time?</span>
          <div class="tab-content">
            <p class="tab-text">
              In case you have more than 1 code, please go to settings -> <a
                target="_blank"
                href="https://app.mailcheck.co/dashboard/appsumo">
                click on "AppSumo"
              </a> here you can activate up to 5 codes.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >Can I activate two and more codes for one account?</span>
          <div class="tab-content">
            <p class="tab-text">
              Yes, you can! We allow the first code to be activated by the
              customer, if you have more, please contact our specialists, and we
              will activate them on your behalf
            </p>
          </div>
        </div>
      </div>
      <div class="accordion-column">
        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >I've chosen mistakenly one of your active plans, can you switch me
            back to AppSumo promo?</span>
          <div class="tab-content">
            <p class="tab-text">
              Please note, in order to proceed through the additional security
              checks and switch back to the previous plan you need to contact
              <a href="mailto:security@mailcheck.co">security@mailcheck.co</a>
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >I want my monthly limits to be increased, what should I do?</span>
          <div class="tab-content">
            <p class="tab-text">
              Unfortunately, during the campaign we are not able to increase the
              limits, as the solution we suggest increasing the limits in 2
              weeks as the AppSumo campaign ends,
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label"
            >Can I verify all 1 200 000 emails at once?</span>
          <div class="tab-content">
            <p class="tab-text">
              Unfortunately, during the campaign we are not able to increase the
              limits, as the solution we suggest increasing the limits in 2
              weeks as the AppSumo campaign ends,
            </p>
          </div>
        </div>
      </div>
    </div>
    <img
      class="filter-img"
      src="/assets/img/filter.png"
      width="444"
      height="568"
      alt="filter" />
  </div>
</section>

<ContactUs />
