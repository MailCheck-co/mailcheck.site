<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/main";
</style>

<script lang="ts">
    import Progress from "./Progress.svelte";

    export let isChecking = false;
    export let isChecked = false;
    export let validityClass = "";

    let emailResult = "";
    let existsResult = "";
    let smtpResult = "";
    let disposableResult = "";
    let catchResult = "";
    let validatyEmailRisk = "";
    let emailInput = "";
    let rateResult = "";
    let loader = false;
    let result = false;
    const reset = () => {
        isChecking = false;
        isChecked = false;
    };
    const keyup = (e) => {
        if (e.target.value === "") reset();
    };
    let links;
    let socialLinks = [
        {
            href: null,
            title: "gravatar",
            className: "gravatar",
        },
        {
            href: null,
            title: "blogger",
            className: "blogger",
        },
        {
            href: null,
            title: "facebook",
            className: "facebook",
        },
        {
            href: null,
            title: "foursquare",
            className: "foursquare",
        },
        {
            href: null,
            title: "google",
            className: "google",
        },
        {
            href: null,
            title: "github",
            className: "github",
        },
        {
            href: null,
            title: "linkedin",
            className: "linkedin",
        },
        {
            href: null,
            title: "tripit",
            className: "tripit",
        },
        {
            href: null,
            title: "tumblr",
            className: "tumblr",
        },
        {
            href: null,
            title: "twitter",
            className: "twitter",
        },
        {
            href: null,
            title: "vimeo",
            className: "vimeo",
        },
        {
            href: null,
            title: "wordpress",
            className: "wordpress",
        },
        {
            href: null,
            title: "youtube",
            className: "youtube",
        }
    ];
    const verifyEmailFormSubmit = async () => {
        isChecking = true;
        result = true;
        loader = true;
        try {
            const response = await fetch("/api/checkMail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailInput,
                }),
            });
            const data = await response.json();
            const exist = data.mxExists ? "+" : "-";
            const smpt = data.smtpExists ? "+" : "-";
            const disposable = data.isNotDisposable ? "+" : "-";
            const catchAll = data.isNotSmtpCatchAll ? "+" : "-";
            emailResult = data.email;
            existsResult = exist;
            smtpResult = smpt;
            rateResult = data.trustRate;
            disposableResult = disposable;
            catchResult = catchAll;

            const gravatar =
                data.gravatar && data.gravatar.entry && data.gravatar.entry[0];

            links = ((gravatar && gravatar.accounts) || []).reduce(
                (acc, el) => {
                    acc[el.shortname] = el.url;
                    return acc;
                },
                { gravatar: (gravatar && gravatar.profileUrl) || "" }
            );

            socialLinks = socialLinks.map((link) => {
                const id = link.title.toLowerCase();
                if (links[id]) {
                    link.href = links[id];
                    link.className = `${link.className}`;
                    return link;
                    
                } else {
                    link.href = null;
                    return link;
                }
            });

            if (data.trustRate <= 49 || data.code >= 400) {
                validatyEmailRisk = "invalid";
                validityClass = "error";
            } else if (data.trustRate > 49 && data.trustRate < 80) {
                validatyEmailRisk = "risky";
                validityClass = "warning";
            } else {
                validatyEmailRisk = "valid";
                validityClass = "success";
            }
            loader = false;
            isChecked = true;
            reset();
        } catch (e) {
            loader = false;
            (e) => console.error(e);
        }
    };
    const closeBtn = () => {
        result = false;
        loader = false;
    };
</script>

<div class="container">
    <div class="wrapper-main sm-left">
        <h1 class="title">Validate your mailing list in one click</h1>
        <p class="main-text">
            Get assured your mailing list contains only real emails addresses,
            get rid of bots and inactive users
        </p>
        <div class="emails-block">
            <div class="main-buttons">
                <a href="//app.mailcheck.co/" class="btn btn-live-demo"
                    >GET FREE EMAILS NOW</a>
                <a href="//app.mailcheck.co/" class="btn btn-start">Start</a>
            </div>
            <div class="verify-email">
                <p class="verify-email-title">
                    Verify email address in real-time!
                </p>
                <form
                    class="verify-email-form"
                    id="verify-email"
                    on:submit|preventDefault="{verifyEmailFormSubmit}">
                    <div class="email-block">
                        <input
                            class="input input-verify"
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email to verify"
                            bind:value="{emailInput}"
                            on:keyup="{keyup}" />
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
                    <div class="email-results" class:result>
                        {#if loader }
                        <div class="form-preloader" ></div>
                        {/if}
                        <p class="results-title">
                            Validation RESULTS -
                            <span id="email-risk" class="{validityClass}">
                                {validatyEmailRisk}
                            </span>
                        </p>
                        <ul class="results-list">
                            <ul class="list-left">
                                <li class="list-item email">
                                    <p class="list-item-title">
                                        Checked email:
                                    </p>
                                    <p
                                        id="email-result"
                                        class="list-item-result">
                                        {emailResult}
                                    </p>
                                </li>
                                <li class="list-item exists">
                                    <p class="list-item-title">Exists:</p>
                                    <p
                                        id="exists-result"
                                        class="list-item-result">
                                        {existsResult}
                                    </p>
                                </li>
                                <li class="list-item smtp">
                                    <p class="list-item-title">SMTP:</p>
                                    <p
                                        id="smtp-result"
                                        class="list-item-result">
                                        {smtpResult}
                                    </p>
                                </li>
                            </ul>
                            <ul class="list-right">
                                <li class="list-item rate">
                                    <p class="list-item-title">Trust rate:</p>
                                    <p
                                        id="rate-result"
                                        class="list-item-result">
                                        {rateResult}
                                    </p>
                                </li>
                                <li class="list-item disposable">
                                    <p class="list-item-title">
                                        Is Not Disposable:
                                    </p>
                                    <p
                                        id="disposable-result"
                                        class="list-item-result">
                                        {disposableResult}
                                    </p>
                                </li>
                                <li class="list-item smpt-ca">
                                    <p class="list-item-title">
                                        Is Not SMTP catch-all:
                                    </p>
                                    <p
                                        id="catch-result"
                                        class="list-item-result">
                                        {catchResult}
                                    </p>
                                </li>
                            </ul>
                        </ul>
                        <div class="results-icons">
                            {#each socialLinks as link}
                                {#if typeof link.href === "string"}
                                    <a
                                        href="{link.href}"
                                        class="{`social-link active ${link.className}`}"
                                        title="{link.title}">&nbsp;</a>
                                {:else}
                                    <span
                                        class="{`social-link ${link.className}`}"
                                        title="{link.title}">&nbsp;</span>
                                {/if}
                            {/each}
                        </div>
                        <button
                            type="button"
                            id="close-btn"
                            class="close-results"
                            on:click="{closeBtn}"></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
