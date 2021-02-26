<script lang="ts">
    import { writable } from "svelte/store";
    import IntersectionObserver from "svelte-intersection-observer";

    function buildValidator(validators: any[]) {
        return function validate(value: string, dirty: boolean) {
            if (!validators || validators.length === 0) {
                return { dirty, valid: true };
            }

            const failing = validators.find((v: any) => v(value) !== true);

            return {
                dirty,
                valid: !failing,
                message: failing && failing(value),
            };
        };
    }

    function createFieldValidator(...validators: any[]) {
        const { subscribe, set } = writable({
            dirty: false,
            valid: false,
            message: null,
        });
        const validator = buildValidator(validators);

        function action(node: any, binding: any) {
            function validate(value: any, dirty: any) {
                const result = validator(value, dirty);
                set(result as any);
            }

            validate(binding, false);

            return {
                update(value: any) {
                    validate(value, true);
                },
            };
        }

        return [{ subscribe }, action];
    }

    function emailValidator() {
        return function email(value: string) {
            return (
                (value &&
                    !!value.match(
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    )) ||
                "Please enter a valid email"
            );
        };
    }

    function requiredValidator() {
        return function required(value: string) {
            return (
                (value !== undefined && value !== null && value !== "") ||
                "This field is required"
            );
        };
    }

    const [validity, validate] = createFieldValidator(
        requiredValidator(),
        emailValidator()
    );

    let email: string = "";
    let once = false;
    let element: any;
    let intersecting: any;
    let isOpen = false;
    let isError = false;
    let contactForm: { reset: () => void; }, popUpBlock: any;
    let nameValue = '';
    let textareaValue = '';
    const onClose = () => {
        isOpen = false;
        isError = false;
        document.body.classList.remove("fixed");
    };
    const onIntersect = () => {
        if (!once) {
            once = true;
        }
    };
    const onSubmit = async() => {
        const referrerValue = document.referrer;
        const data = {
            name: nameValue,
            email,
            subject: textareaValue,
            referrer: referrerValue,
        };

        try {
            await fetch("/api/sendMail", {
            method: "POST",
            body: JSON.stringify(data),
            });
            isOpen = true;
            contactForm.reset();
        } catch (e) {
            isOpen = true;
            isError = true;
            console.error(e);
        }

        document.body.classList.add("fixed");
        window.dataLayer?.push({
            eventCategory: "site",
            eventAction: "contactform",
            eventLabel: "submit",
            eventValue: "",
            event: "gaEvent",
        });
    };
</script>

<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/contact-us";
  @import "../scss/molecules/popup";
</style>

<IntersectionObserver threshold={0.2} {element} bind:intersecting on:observe={onIntersect}>
    <section
        bind:this={element}
        class:intersecting={() => !once}
        class="contact-us"
        id="contact-us">
        <div class="container">
            <form
                class="contact-form"
                bind:this={contactForm}
                on:submit|preventDefault={onSubmit}>
                <h2 class="title title-contact">contact us</h2>
                <input
                    class="input input-name"
                    type="text"
                    placeholder="Name"
                    bind:value={nameValue}
                    required />
                <input
                    class="input input-email"
                    type="text"
                    bind:value={email}
                    placeholder="Email"
                    class:invalid={(!$validity.valid)}
                    use:validate={email}
                    required
                    />
                <textarea
                    class="input input-message"
                    bind:value="{textareaValue}"
                    placeholder="Message"
                    required />
                <button
                    disabled={!$validity.valid|| !$validity.dirty}
                    class="btn btn-submit"
                    type="submit">submit</button>
            </form>
        </div>
    </section>
</IntersectionObserver>

<div
    class="popup-container"
    class:open={isOpen}
    on:click={onClose}
    bind:this={popUpBlock}>
    <div class="popup" class:open={isOpen}>
        <span class="popup-close success" />
        <span class="popup-thanks">Thanks for filling out our form!</span>
        <p class="popup-text">
            We will look over your message and get back to you by tomorrow. Your
            friends at MailCheck!
        </p>
    </div>
    <div class="popup" class:open={isError && isOpen}>
        <span class="popup-close error" />
        <span class="popup-thanks">Something went wrong!</span>
        <p class="popup-text">Please try again later</p>
    </div>
</div>
