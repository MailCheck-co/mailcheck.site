<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/frequent-questions";
</style>

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement;
  let intersecting: boolean;
</script>

<IntersectionObserver threshold="{0.2}" element="{element}" bind:intersecting>
  <section bind:this="{element}" class="frequent-questions">
    <div class="wrapper-questions">
      <h3 class="title-small">FAQ</h3>

      <div class="accordion">
        <div class="accordion-column">
          <div class="tab">
            <input
              class="input-radio"
              type="checkbox"
              id="radio1"
              name="acc-tabs" />
            <label class="tab-label" for="radio1"
              >Where do you get the data for verification?</label>
            <div class="tab-content">
              <p class="tab-text">
                We take the data from public sources, system search, social
                networks, and open databases available online.
              </p>
            </div>
          </div>

          <div class="tab">
            <input
              class="input-radio"
              type="checkbox"
              id="radio8"
              name="acc-tabs" />
            <label class="tab-label" for="radio8"
              >How to interpret a trust rate?</label>
            <div class="tab-content">
              <p class="tab-text">
                * Emails with a trust rate of 0-49% are Risky and most likely
                INVALID, we don't recommend using them<br />
                * Emails with a trust rate of 50-100% are VALID, feel free to use
                them<br />
              </p>
            </div>
          </div>

          <div class="tab">
            <input
              class="input-radio"
              type="checkbox"
              id="radio12"
              name="acc-tabs" />
            <label class="tab-label" for="radio12"
              >What is the delimiter and how to use it?</label>
            <div class="tab-content">
              <p class="tab-text">
                A delimiter is the comma character, which acts as a field
                delimiter, we ask to set it in order to validate the chosen
                column, NOTE it only has to be an email column
              </p>
            </div>
          </div>
        </div>

        <div class="accordion-column">
          <div class="tab">
            <input
              class="input-radio"
              type="checkbox"
              id="radio14"
              name="acc-tabs" />
            <label class="tab-label" for="radio14">Is my data protected?</label>
            <div class="tab-content">
              <p class="tab-text">
                All information about our users is protected by Google systems,
                we do really care about privacy and that's why never share any
                data due to the GDPR compliance.
              </p>
            </div>
          </div>

          <div class="tab">
            <input
              class="input-radio"
              type="checkbox"
              id="radio15"
              name="acc-tabs" />
            <label class="tab-label" for="radio15"
              >How many free email verifications do you offer?</label>
            <div class="tab-content">
              <p class="tab-text">
                We allow 100 free email validations if the billing information
                was verified, and 10 free email validations if the payment
                details weren't provided<br />
                - with card 100 emails<br />
                - without card 10 emails<br />
              </p>
            </div>
          </div>

          <div class="tab">
            <input
              class="input-radio"
              type="checkbox"
              id="radio23"
              name="acc-tabs" />
            <label class="tab-label" for="radio23"
              >I was charged more than my plan costs</label>
            <div class="tab-content">
              <p class="tab-text">
                Mailcheck works on a subscription basis and if you have any of
                the paid plans (PRO, AGENCY, ENTERPRISE, LEGENDARY) so you are
                able to verify more emails than you have according to your plan,
                to receive more detailed information, please contact our support
                team
              </p>
            </div>
          </div>
        </div>
      </div>

      <a sapper:prefetch href="/faq" class="btn btn-start">LEARN MORE</a>

      <img
        class="filter-img"
        src="../assets/img/filter.png"
        width="444"
        height="568"
        alt="filter" />
    </div>
  </section>
</IntersectionObserver>
