<script lang="typescript">
  import Seo from '$lib/Seo/index.svelte';
  import { websiteSchema } from '$utils/json-ld';
  import filter from './filter.png';
</script>

<Seo desc="FAQ" title="FAQ" schemas={[websiteSchema]} />

<!--Questions-->
<section id="faq" class="frequent-questions faq-page">
  <div class="wrapper-questions">
    <h3 class="title-small">FAQ</h3>

    <div class="accordion">
      <div class="accordion-column">
        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Where do you get the data for verification?</span>
          <div class="tab-content">
            <p class="tab-text">
              We take the data from public sources, system search, social networks, and open
              databases available online.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">What social networks do you use for validation?</span>
          <div class="tab-content">
            <p class="tab-text">We use - Google, Gravatar, Linkedin, Facebook, etc.</p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">What is your difference from the competitors?</span>
          <div class="tab-content">
            <p class="tab-text">
              The main difference from our competitors is that we do not use only the automatic
              search and validation but we provide manual moderation, so we use all the power of
              social networks and search engines for more in-depth validation.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">What is your trial?</span>
          <div class="tab-content">
            <p class="tab-text">
              We let our customers potentially feel the difference by verifying 10 emails FOR FREE
              without adding a payment method and increase the number of verifications up to 100
              emails with the payment method added.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Do you check phone numbers?</span>
          <div class="tab-content">
            <p class="tab-text">
              We are currently testing a beta version of our phone base validations. But it is
              available in manual mode. In order to check the phone base, please <a
                href="mailto:support+faq@mailcheck.co">contact our support team</a
              >.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How to get started with Mailcheck?</span>
          <div class="tab-content">
            <p class="tab-text">
              <b>Step 1</b><br />
              - Go to https://app.mailcheck.co/auth/login and create an account<br />
              - Our registration process is one of the easiest in the known systems<br />
              <b>Step 2</b>
              - Set your email address and password<br />
              <b>Step 3</b>
              - Fill in your profile information or Skip if you don't have time<br />
              <b>Step 4</b>
              - Choose the plan you want to go with or skip if you don't have time<br />
              <b>Step 5</b><br />
              - Set your billing information ( in case you didn't choose a plan, you can still go with
              "Free Tier" 100 emails for free)<br />
              - We have two scenarios if you want a free tier<br />
              1) 10 emails if you didn't set your card<br />
              2) 100 emails if your card details were provided (we don't charge you anything unless you
              previously has chosen a plan)<br />
              <b>Step 6</b>
              - Ta da! You are in<br />
              <b>Step 7</b>
              - If you have any questions, always
              <a href="mailto:support+faq@mailcheck.co">ping our support team</a><br />
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How to get verified your first list?</span>
          <div class="tab-content">
            <p class="tab-text">
              <b>Step 1</b>
              - If you have data collected in .csv, .tsv formats, feel free to click "Upload"<br />
              <b>Step 2</b>
              - Drag and drop your file or choose from your computer<br />
              <b>Step 3</b>
              - specify a delimiter (choose one column with emails only)<br />
              <b>Step 4</b>
              - send a file for the validation<br />
              <b>Step 5</b>
              - go to the uploaded files and click "Process"<br />
              <b>Step 6</b>
              - When the file processed, you will receive results as the download button inside the site
              or via email<br />
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How to interpret a trust rate?</span>
          <div class="tab-content">
            <p class="tab-text">
              * Emails with a trust rate of 0-49% are Risky and most likely INVALID, we don't
              recommend using them<br />
              * Emails with a trust rate of 50-100% are VALID, feel free to use them<br />
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How can I sign up?</span>
          <div class="tab-content">
            <p class="tab-text">
              <b>Step 1</b>
              - We made our service so easy, that no extra confirmation required, simply set your email
              and password to register<br />
              <b>Step 2</b>
              - Use your Google, facebook account to register with us<br />
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How can I login?</span>
          <div class="tab-content">
            <p class="tab-text">
              - Fill in email/password<br />
              - Log in using Google or Facebook<br />
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How to delete an account at Mailcheck?</span>
          <div class="tab-content">
            <p class="tab-text">
              If you want to delete account because of the uploaded database, you can simply hide
              all of the info or <a href="mailto:support+faq@mailcheck.co">contact support</a> so your
              account can be deactivated
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">What is the delimiter and how to use it?</span>
          <div class="tab-content">
            <p class="tab-text">
              A delimiter is the comma character, which acts as a field delimiter, we ask to set it
              in order to validate the chosen column, NOTE it only has to be an email column
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How to prepare a list to get it verified?</span>
          <div class="tab-content">
            <p class="tab-text">
              If you data in Google Sheets or Excel you can export them to .csv and upload to your
              Mailcheck account
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How can I get my API key</span>
          <div class="tab-content">
            <p class="tab-text">
              A step-by-step guide to
              <a sveltekit:prefetch title="API key creation" href="/create-api-key">
                API key creation
              </a>
            </p>
          </div>
        </div>
      </div>

      <div class="accordion-column">
        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Is my data protected?</span>
          <div class="tab-content">
            <p class="tab-text">
              All information about our users is protected by Google systems, we do really care
              about privacy and that's why never share any data due to the GDPR compliance.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How many free email verifications do you offer?</span>
          <div class="tab-content">
            <p class="tab-text">
              We allow 100 free email validations if the billing information was verified, and 10
              free email validations if the payment details weren't provided<br />
              - with card 100 emails<br />
              - without card 10 emails<br />
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">What is a quick validation?</span>
          <div class="tab-content">
            <p class="tab-text">
              Quick validation aimed to help our customers to verify a single email without loading
              the complete .csv file, it helps to save time and get the result right away. You can
              quickly validate your email here -
              <a href="https://app.mailcheck.co/dashboard/">https://app.mailcheck.co/dashboard/</a>
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Downloading Verified Lists</span>
          <div class="tab-content">
            <p class="tab-text">
              We send the results via dashboard
              <a href="https://app.mailcheck.co/dashboard/my_files"
                >https://app.mailcheck.co/dashboard/my_files</a>
              as well as an email notification, all you need to do is to click on "Download" sign or
              button and save on your Computer to preview
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Integrations</span>
          <div class="tab-content">
            <p class="tab-text">As of now, we are developing Mailchimp integration.</p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How does Mailcheck work?</span>
          <div class="tab-content">
            <p class="tab-text">
              Mailcheck is one place where you can validate all of your emails. Besides the plans we
              offer, we also don't set the limits for email validations on paid plans, while
              processing an overcharge. Imagine you have a list of 1200 emails and currently
              purchased a "PRO" plan. Since the PRO plan includes 1000 emails, we will do 200 email
              validation and at the end of the billing cycle will inform about the overcharge.
              Overuse charge: $0.005 for the PRO plan For more please visit
              <a href="https://app.mailcheck.co/dashboard/payment_plans"
                >https://app.mailcheck.co/dashboard/payment_plans</a>
              or
              <a href="mailto:support+faq@mailcheck.co"> contact our support team</a>
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">What is the overuse charge?</span>
          <div class="tab-content">
            <p class="tab-text">
              Since Mailcheck doesn't set any limits for the verification we allow our clients under
              the paid subscriptions to verify as many emails as they can, overuse charge applies
              when the plan limited was used up. For example, the overuse charge for the PRO =
              $0.005 Agency = $0.004 Enterprise = $0.003 The bigger plan you choose the lower
              overuse charge can be
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Can I delete my files?</span>
          <div class="tab-content">
            <p class="tab-text">
              In the Mailcheck we allow our clients to hide their data, just follow the link
              <a href="https://app.mailcheck.co/dashboard/my_files"
                >https://app.mailcheck.co/dashboard/my_files</a>
              and choose "X" sign next to each file
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How can I cancel my subscription?</span>
          <div class="tab-content">
            <p class="tab-text">
              In order to cancel a subscription, please <a href="mailto:support+faq@mailcheck.co"
                >contact our support team</a
              >.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">I was charged more than my plan costs</span>
          <div class="tab-content">
            <p class="tab-text">
              Mailcheck works on a subscription basis and if you have any of the paid plans (PRO,
              AGENCY, ENTERPRISE, LEGENDARY) so you are able to verify more emails than you have
              according to your plan, to receive more detailed information, please <a
                href="mailto:support+faq@mailcheck.co">contact our support team</a>
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Why I can't see a dark mode option on my account?</span>
          <div class="tab-content">
            <p class="tab-text">
              We apply Dark Mode only for those users who have purchased paid plans and planning to
              develop more features
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">How long does usually take to verify 1M files?</span>
          <div class="tab-content">
            <p class="tab-text">
              It depends but usually takes around 20min-60min just because our innovative technology
              allows making in-depth validation and run the data through multiply sources making
              sure we give the most accurate answer.
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Mailchimp Integration instructions</span>
          <div class="tab-content">
            <p class="tab-text">
              Step by step guide on how to use
              <a
                sveltekit:prefetch
                title="Mailchimp Integration instructions"
                href="/mailchimp-integration">
                Mailchimp
              </a>
            </p>
          </div>
        </div>

        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Zapier Integration instructions</span>
          <div class="tab-content">
            <p class="tab-text">
              A step-by-step guide to integrate Mailcheck with daily services using
              <a
                sveltekit:prefetch
                title="Zapier Integration instructions"
                href="/zapier-integration">
                Zapier
              </a>
            </p>
          </div>
        </div>
        <div class="tab">
          <input class="input-radio" type="checkbox" name="acc-tabs" />
          <span class="tab-label">Integromat Integration instructions</span>
          <div class="tab-content">
            <p class="tab-text">
              A step-by-step guide to integrate Mailcheck with daily services using
              <a
                sveltekit:prefetch
                title="Integromat Integration instructions"
                href="/integromat-integration">
                Integromat
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <img class="filter-img" src={filter} width="444" height="568" alt="filter" />
  </div>
</section>

<style lang="scss">
  .accordion {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin: 50px 20px 50px;
  }

  .accordion-column {
    width: 48%;
  }

  .filter-img {
    position: absolute;
    top: 10%;
    right: 0;
    z-index: -1;
    width: 444px;
    height: auto;
    opacity: 0.1;
    pointer-events: none;
  }

  .input-radio {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    height: 40px;
    cursor: pointer;
    opacity: 0;

    &:checked ~ .tab-content {
      height: auto;
      padding: 10px 0;
      overflow: hidden;
      visibility: visible;
      opacity: 1;
    }

    &:checked ~ .tab-label::after {
      transform: rotate(135deg);
    }

    &:checked ~ .tab-label {
      padding-bottom: 5px;
    }
  }

  .tab {
    position: relative;
    margin-bottom: 14px;
    border-bottom: 1px solid var(--dark-02);
  }

  .tab-content {
    height: 0;
    overflow: hidden;
    visibility: hidden;
    opacity: 0;
    transition: 0.35s ease-in-out;

    &::-webkit-scrollbar {
      width: 0.3em;
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(17, 50, 78, 0.2);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-accent);
      border: 2px solid var(--primary-accent);
      border-radius: 5px;
    }
  }

  .tab-text {
    margin-top: 0;
    padding: 0 10px;
    color: var(--primary-white);
    font-size: var(--size-16);
    text-align: initial;
    text-indent: initial;
    word-break: break-word;
  }

  .tab-label {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 0 13px 13px 10px;
    color: var(--primary-white);
    font-weight: var(--weight-500);
    font-size: var(--size-18);
    line-height: 27px;
    letter-spacing: 0.9px;

    &::after {
      position: absolute;
      top: 10px;
      right: 0;
      display: block;
      width: 5px;
      height: 5px;
      border-bottom: 1px solid var(--primary-accent);
      border-left: 1px solid var(--primary-accent);
      transform: rotate(-45deg);
      transition: all 0.5s ease;
      content: '';
    }
  }

  .title-small {
    width: 100%;
    color: var(--primary-white);
    font-weight: var(--weight-600);
    font-size: var(--size-32);
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
      color: var(--section-titles-color);
      font-weight: var(--weight-900);
      font-size: var(--size-160);
      text-transform: uppercase;
      content: 'faq';
    }
  }

  .wrapper-questions {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    max-width: 1280px;
    margin: 0 auto 50px;
    padding: 50px 20px 0;
  }

  @media only screen and (max-width: 1024px) {
    .accordion {
      margin: 0 0 50px 0;
    }

    .filter-img {
      transform: none;
    }

    .title-small::before {
      display: none;
    }
  }

  @media only screen and (max-width: 768px) {
    .accordion {
      flex-direction: column;
      justify-content: start;
      max-width: 80%;
      margin: 0 0 30px 0;
      padding: 0 10px;
    }

    .accordion-column {
      width: 100%;
    }

    .filter-img {
      order: -1;
      width: 50%;
      min-width: 10%;
      max-width: 70%;
      margin-bottom: 25px;
      transform: translateY(50px);
    }

    .wrapper-questions {
      justify-content: center;
      padding: 50px 20px 0;
    }
  }
</style>
