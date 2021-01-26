<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/frequent-questions";
</style>
<script lang="typescript">
    import Seo from "../components/seo.svelte";
</script>

<Seo title="Mailcheck | FAQ" />

<!--Questions-->
<section id="faq" class="frequent-questions">
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
                    <label class="tab-label" for="radio1">Where do you get the
                        data for verification?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We take the data from public sources, system search,
                            social networks, and open databases available
                            online.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio2"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio2">What social networks
                        do you use for validation?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We use - Google, Gravatar, Linkedin, Facebook, etc.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio3"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio3">What is your
                        difference from the competitors?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            The main difference from our competitors is that we
                            do not use only the automatic search and validation
                            but we provide manual moderation, so we use all the
                            power of social networks and search engines for more
                            in-depth validation.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio4"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio4">What is your trial?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We let our customers potentially feel the difference
                            by verifying 10 emails FOR FREE without adding a
                            payment method and increase the number of
                            verifications up to 100 emails with the payment
                            method added.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio5"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio5">Do you check phone
                        numbers?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We are currently testing a beta version of our phone
                            base validations. But it is available in manual
                            mode. In order to check the phone base, please
                            contact our support team.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio6"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio6">How to get started
                        with Mailcheck?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Step 1<br />
                            - Go to https://app.mailcheck.co/auth/login and
                            create an account<br />
                            - Our registration process is one of the easiest in
                            the known systems<br />
                            Step 2<br />
                            - Set your email address and password<br />
                            Step 3<br />
                            - Fill in your profile information or Skip if you
                            don't have time<br />
                            Step 4<br />
                            - Choose the plan you want to go with or skip if you
                            don't have time<br />
                            Step 5<br />
                            - Set your billing information ( in case you didn't
                            choose a plan, you can still go with ""Free Tier""
                            100 emails for free)<br />
                            - We have two scenarios if you want a free tier<br />
                            1) 10 emails if you didn't set your card<br />
                            2) 100 emails if your card details were provided (we
                            don't charge you anything unless you previously has
                            chosen a plan)<br />
                            Step 6<br />
                            - Ta da! You are in<br />
                            Step 7<br />
                            - If you have any questions, always ping our support
                            team<br />
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio7"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio7">How to get verified
                        your first list?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Step 1<br />
                            - If you have data collected in .csv, .tsv formats,
                            feel free to click ""Upload""<br />
                            Step 2<br />
                            - Drag and drop your file or choose from your
                            computer<br />
                            Step 3<br />
                            - specify a delimiter (choose one column with emails
                            only)<br />
                            Step 4<br />
                            - send a file for the validation<br />
                            Step 5<br />
                            - go to the uploaded files and click ""Process""<br />
                            Step 6<br />
                            - When the file processed, you will receive results
                            as the download button inside the site or via email<br />
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio8"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio8">How to interpret a
                        trust rate?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            * Emails with a trust rate of 0-49% are Risky and
                            most likely INVALID, we don't recommend using them<br />
                            * Emails with a trust rate of 50-100% are VALID,
                            feel free to use them<br />
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio9"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio9">How can I sign up?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Step 1<br />
                            - We made our service so easy, that no extra
                            confirmation required, simply set your email and
                            password to register<br />
                            Step 2<br />
                            - Use your Google, facebook account to register with
                            us<br />
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio10"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio10">How can I login?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            - Fill in email/password<br />
                            - Log in using Google or Facebook<br />
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio11"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio11">How to delete an
                        account at Mailcheck?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            If you want to delete account because of the
                            uploaded database, you can simply hide all of the
                            info or contact support so your account can be
                            deactivated
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio12"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio12">What is the delimiter
                        and how to use it?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            A delimiter is the comma character, which acts as a
                            field delimiter, we ask to set it in order to
                            validate the chosen column, NOTE it only has to be
                            an email column
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio13"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio13">How to prepare a list
                        to get it verified?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            If you data in Google Sheets or Excel you can export
                            them to .csv and upload to your Mailcheck account
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
                            All information about our users is protected by
                            Google systems, we do really care about privacy and
                            that's why never share any data due to the GDPR
                            compliance.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio15"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio15">How many free email
                        verifications do you offer?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We allow 100 free email validations if the billing
                            information was verified, and 10 free email
                            validations if the payment details weren't provided<br />
                            - with card 100 emails<br />
                            - without card 10 emails<br />
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio16"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio16">What is a quick
                        validation?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Quick validation aimed to help our customers to
                            verify a single email without loading the complete
                            .csv file, it helps to save time and get the result
                            right away. You can quickly validate your email here
                            -
                            <a
                                href="https://app.mailcheck.co/dashboard/">https://app.mailcheck.co/dashboard/</a>
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio17"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio17">Downloading Verified
                        Lists</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We send the results via dashboard
                            <a
                                href="https://app.mailcheck.co/dashboard/my_files">https://app.mailcheck.co/dashboard/my_files</a>
                            as well as an email notification, all you need to do
                            is to click on "Download" sign or button and save on
                            your Computer to preview
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio18"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio18">Integrations</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            As of now, we are developing Mailchimp integration.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio19"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio19">How does Mailcheck
                        work?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Mailcheck is one place where you can validate all of
                            your emails. Besides the plans we offer, we also
                            don't set the limits for email validations on paid
                            plans, while processing an overcharge. Imagine you
                            have a list of 1200 emails and currently purchased a
                            ""PRO"" plan. Since the PRO plan includes 1000
                            emails, we will do 200 email validation and at the
                            end of the billing cycle will inform about the
                            overcharge. Overuse charge: $0.005 for the PRO plan
                            For more please visit
                            <a
                                href="https://app.mailcheck.co/dashboard/payment_plans">https://app.mailcheck.co/dashboard/payment_plans</a>
                            or contact our support team
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio20"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio20">What is the overuse
                        charge?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Since Mailcheck doesn't set any limits for the
                            verification we allow our clients under the paid
                            subscriptions to verify as many emails as they can,
                            overuse charge applies when the plan limited was
                            used up. For example, the overuse charge for the PRO
                            = $0.005 Agency = $0.004 Enterprise = $0.003 The
                            bigger plan you choose the lower overuse charge can
                            be
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio21"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio21">Can I delete my
                        files?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            In the Mailcheck we allow our clients to hide their
                            data, just follow the link
                            <a
                                href="https://app.mailcheck.co/dashboard/my_files">https://app.mailcheck.co/dashboard/my_files</a>
                            and choose "X" sign next to each file
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio22"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio22">How can I cancel my
                        subscription?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            In order to cancel a subscription, please contact
                            our support team.
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio23"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio23">I was charged more
                        than my plan costs</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            Mailcheck works on a subscription basis and if you
                            have any of the paid plans (PRO, AGENCY, ENTERPRISE,
                            LEGENDARY) so you are able to verify more emails
                            than you have according to your plan, to receive
                            more detailed information, please contact our
                            support team
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio24"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio24">Why I can't see a
                        dark mode option on my account?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            We apply Dark Mode only for those users who have
                            purchased paid plans and planning to develop more
                            features
                        </p>
                    </div>
                </div>

                <div class="tab">
                    <input
                        class="input-radio"
                        type="checkbox"
                        id="radio25"
                        name="acc-tabs" />
                    <label class="tab-label" for="radio25">How long does usually
                        take to verify 1M files?</label>
                    <div class="tab-content">
                        <p class="tab-text">
                            It depends but usually takes around 20min-60min just
                            because our innovative technology allows making
                            in-depth validation and run the data through
                            multiply sources making sure we give the most
                            accurate answer.
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
