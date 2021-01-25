<script>
    import { onMount } from "svelte";
    import Progress from "./Progress.svelte";

    export let isChecking = false;
    export let isChecked = false;
    export let validityClass = '';

    onMount(() => {
        const verifyEmailForm = document.getElementById("verify-email");
        const emailResults = verifyEmailForm.querySelector(".email-results");

        const reset = () => {
            verifyEmailForm.reset();
            isChecking = false;
            isChecked = false;
            validityClass = '';
        }

        verifyEmailForm.addEventListener("submit", (e) => {
            isChecking = true;
            const emailValue = verifyEmailForm.querySelector(
                "input[type=email]"
            ).value;
            const socialLinks = document.querySelectorAll(".social-link");
            const validity = document.getElementById("email-risk");
            const closeBtn = document.getElementById("close-btn");
            const formPreloader = emailResults.querySelector(".form-preloader");

            e.preventDefault();

            emailResults.style.display = "block";

            fetch("/checkMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailValue,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    const exist = data.mxExists ? "+" : "-";
                    const smpt = data.smtpExists ? "+" : "-";
                    const disposable = data.isNotDisposable ? "+" : "-";
                    const catchAll = data.isNotSmtpCatchAll ? "+" : "-";
                    document.getElementById("email-result").innerHTML =
                        data.email;
                    document.getElementById("exists-result").innerHTML = exist;
                    document.getElementById("smtp-result").innerHTML = smpt;
                    document.getElementById("rate-result").innerHTML =
                        data.trustRate;
                    document.getElementById(
                        "disposable-result"
                    ).innerHTML = disposable;
                    document.getElementById(
                        "catch-result"
                    ).innerHTML = catchAll;
                    const gravatar =
                        data.gravatar &&
                        data.gravatar.entry &&
                        data.gravatar.entry[0];
                    const links = (
                        (gravatar && gravatar.accounts) ||
                        []
                    ).reduce(
                        (acc, el) => {
                            acc[el.shortname] = el.url;
                            return acc;
                        },
                        { gravatar: (gravatar && gravatar.profileUrl) || "" }
                    );

                    socialLinks.forEach((link) => {
                        const id = link.title.toLowerCase();
                        if (links[id]) {
                            link.href = links[id];
                            link.classList.add("active");
                        } else {
                            link.href = "#";
                            link.classList.remove("active");
                        }
                    });
                    if (data.trustRate <= 49) {
                        validity.innerHTML = "invalid";
                        validityClass = "error";
                    } else if (data.trustRate > 49 && data.trustRate < 80) {
                        validity.innerHTML = "risky";
                        validityClass = "warning";
                    } else {
                        validity.innerHTML = "valid";
                        validityClass = "success";
                    }
                    isChecked = true;
                })
                .then(() => reset())
                .catch((e) => console.error(e));

            formPreloader.style.display = "none";

            closeBtn.addEventListener("click", () => {
                document.querySelector(".email-results").style.display = "none";
            });
        });
    });
</script>

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

                        {#if isChecking && !isChecked}
                            <div class="progress-wrapper">
                                <Progress />
                            </div>
                        {:else}
                            <button type="submit" class="btn-verify-email">
                                <img
                                    src="assets/img/icon-arrow-right.svg"
                                    alt="Verify email" />
                            </button>
                        {/if}
                    </div>
                    <div class="email-results">
                        <div class="form-preloader" />
                        <p class="results-title">
                            Validation RESULTS -
                            <span id="email-risk" class:validityClass />
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
