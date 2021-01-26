<script>
    import IntersectionObserver from "svelte-intersection-observer";

    let element;
    let intersecting;
    let isOpen = false;
    let isError = false;
    let contactForm, popUpBlock;
    const onClose = () => {
        isOpen = false;
        isError = false;
        document.body.classList.remove("fixed");
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const nameValue = contactForm.querySelector("input[type=text]").value;
        const mailValue = contactForm.querySelector("input[type=email]").value;
        const textareaValue = contactForm.querySelector(".input-message").value;
        const referrerValue = document.referrer;
        const data = {
            name: nameValue,
            email: mailValue,
            subject: textareaValue,
            referrer: referrerValue,
        };

        const formData = new FormData();

        for (let name in data) {
            formData.append(name, data[name]);
        }

        fetch("/sendMail", {
            method: "POST",
            body: JSON.stringify(data),
        })
            .then((res) => res.text())
            .then(() => {
                isOpen = true;
                contactForm.reset();
            })
            .catch((e) => {
                document.querySelector("popup-text").textContent = e;
                isOpen = true;
                isError = true;
            });

        document.body.classList.add("fixed");
        window.dataLayer.push({
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

<IntersectionObserver {element} bind:intersecting>
    <section bind:this={element} class:intersecting class="contact-us" id="contact-us">
        <div class="container">
            <form
                class="contact-form"
                bind:this={contactForm}
                on:submit={onSubmit}>
                <h2 class="title title-contact">contact us</h2>
                <input class="input" type="text" placeholder="Name" required />
                <input
                    class="input"
                    type="email"
                    placeholder="Email"
                    required />
                <textarea
                    class="input input-message"
                    placeholder="Message"
                    required />
                <button class="btn btn-submit" type="submit">submit</button>
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
