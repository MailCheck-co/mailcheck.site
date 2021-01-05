<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/main";
</style>

<div class="container">
    <div class="wrapper-main sm-left">
        <h1 class="title">Validate your mailing list in one click</h1>
        <p class="main-text">
            Get assured your mailing list contains only real emails addresses,
            get rid of bots and inactive users
        </p>
        <div class="emails-block">
            <div class="main-buttons">
                <a href="//app.mailcheck.co/" class="btn btn-live-demo">GET FREE
                    EMAILS NOW</a>
                <a href="//app.mailcheck.co/" class="btn btn-start">Start</a>
            </div>
            <div class="verify-email">
                <p class="verify-email-title">
                    Verify email address in real-time!
                </p>
                <form action="#" class="verify-email-form" id="verify-email">
                    <div class="email-block">
                        <input
                            class="input input-verify"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email to verify" />
                        <button type="submit" class="btn-verify-email">
                            <img
                                src="assets/img/icon-arrow-right.svg"
                                alt="Verify email" />
                        </button>
                    </div>
                    <div class="email-results">
                        <div class="form-preloader" />
                        <p class="results-title">
                            Validation RESULTS -
                            <span id="email-risk" />
                        </p>
                        <ul class="results-list">
                            <ul class="list-left">
                                <li class="list-item email">
                                    <p class="list-item-title">
                                        Checked email:
                                    </p>
                                    <p
                                        id="email-result"
                                        class="list-item-result" />
                                </li>
                                <li class="list-item exists">
                                    <p class="list-item-title">Exists:</p>
                                    <p
                                        id="exists-result"
                                        class="list-item-result" />
                                </li>
                                <li class="list-item smtp">
                                    <p class="list-item-title">SMTP:</p>
                                    <p
                                        id="smtp-result"
                                        class="list-item-result" />
                                </li>
                            </ul>
                            <ul class="list-right">
                                <li class="list-item rate">
                                    <p class="list-item-title">Trust rate:</p>
                                    <p
                                        id="rate-result"
                                        class="list-item-result" />
                                </li>
                                <li class="list-item disposable">
                                    <p class="list-item-title">
                                        Is Not Disposable:
                                    </p>
                                    <p
                                        id="disposable-result"
                                        class="list-item-result" />
                                </li>
                                <li class="list-item smpt-ca">
                                    <p class="list-item-title">
                                        Is Not SMTP catch-all:
                                    </p>
                                    <p
                                        id="catch-result"
                                        class="list-item-result" />
                                </li>
                            </ul>
                        </ul>
                        <div class="results-icons">
                            <a
                                href="#"
                                class="social-link gravatar"
                                title="Gravatar" />
                            <a
                                href="#"
                                class="social-link blogger"
                                title="Blogger" />
                            <a
                                href="#"
                                class="social-link facebook"
                                title="Facebook" />
                            <a
                                href="#"
                                class="social-link foursquare"
                                title="Foursquare" />
                            <a
                                href="#"
                                class="social-link google"
                                title="Google" />
                            <a
                                href="#"
                                class="social-link github"
                                title="Github" />
                            <a
                                href="#"
                                class="social-link linkedin"
                                title="Linkedin" />
                            <a
                                href="#"
                                class="social-link tripit"
                                title="Tripit" />
                            <a
                                href="#"
                                class="social-link tumblr"
                                title="Tumblr" />
                            <a
                                href="#"
                                class="social-link twitter"
                                title="Twitter" />
                            <a
                                href="#"
                                class="social-link vimeo"
                                title="Vimeo" />
                            <a
                                href="#"
                                class="social-link wordpress"
                                title="Wordpress" />
                            <a
                                href="#"
                                class="social-link youtube"
                                title="Youtube" />
                        </div>
                        <button
                            type="button"
                            id="close-btn"
                            class="close-results" />
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
