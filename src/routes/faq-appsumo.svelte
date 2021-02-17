<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/frequent-questions";
</style>
<script lang="typescript">
    import Seo from "../components/seo.svelte";
</script>

<Seo title="FAQ AppSumo" canonical="/faq" />

<!--Questions-->
<section id="faq-appsumo" class="frequent-questions faq-page">
    <div class="wrapper-questions">
        <h3 class="title-small">FAQ AppSumo</h3>

        <div class="accordion">
            <div class="accordion-column">
                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio1"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio1">What's the difference between the Mailcheck and previous competitor offers?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Mailcheck provides the highest amount of the email validations AppSumo ever had, with 100,000 credits monthly limit.
                            Currently, we allow Sumolings to verify 1 200,000  credits lifetime.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio2"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio2">I got a CMS built website is there a way to use your service?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We have several solutions,

                            <br /><br />1) If you are using WordPress, you can install our plugin https://wordpress.org/plugins/mailcheck-co/ and set it up on your website, we're constantly updating our code, so you can fully rely on us.

                            <br /><br />2)Use our API to simply copy and paste within the website https://app.mailcheck.co/docs#tag--email
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio3"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio3">I've bought several codes, how can I use them at a time?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            In case you have more than 1 code, please go to settings -> click on "AppSumo" https://app.mailcheck.co/dashboard/appsumo here you can activate up to 5 codes.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio4"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio4">Can I activate two and more codes for one account?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Yes, you can! We allow the first code to be activated by the customer, if you have more, please contact our specialists, and we will activate them on your behalf
                        </p>
                    </div>
                </div>
            </div>
            <div class="accordion-column">
                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio5"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio5">Can I re-sell the code?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            If you feel one code is enough for the usage, you can share the other one with your friends, please note, there is no way to use the same promo code twice.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio6"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio6">I've chosen mistakenly one of your active plans, can you switch me back to AppSumo promo?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Please note, in order to proceed through the additional security checks and switch back to the previous plan you need to contact security@mailcheck.co
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio7"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio7">I want my monthly limits to be increased, what should I do?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Unfortunately, during the campaign we are not able to increase the limits, as the solution we suggest increasing the limits in 2 weeks as the AppSumo campaign ends,
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio8"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio8">Can I verify all 1 200 000 emails at once?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Unfortunately, during the campaign we are not able to increase the limits, as the solution we suggest increasing the limits in 2 weeks as the AppSumo campaign ends,
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <img
            class="filter-img"
            src="../assets/img/filter.png"
            width="444"
            height="568"
            alt="filter" />
    </div>
</section>
