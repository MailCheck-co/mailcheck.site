<script>
    import Popup from "./Popup.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        const contactForm = document.getElementById("contact-us");
        const popUpSuccess = document.getElementById("popup-success");
        const popUpError = document.getElementById("popup-error");
        const popUpBlock = document.getElementById("popup-block");

        contactForm.addEventListener("submit", function (e) {
            const nameValue = contactForm.querySelector("input[type=text]")
                .value;
            const mailValue = contactForm.querySelector("input[type=email]")
                .value;
            const textareaValue = contactForm.querySelector(".input-message")
                .value;
            const referrerValue = document.referrer;

            e.preventDefault();

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
                    popUpBlock.classList.add("open");
                    popUpSuccess.classList.add("open");
                    contactForm.reset();
                })
                .catch((e) => {
                    document.querySelector("popup-text").textContent = e;
                    popUpBlock.classList.add("open");
                    popUpError.classList.add("open");
                });

            document.body.classList.add("fixed");
            window.dataLayer.push({
                eventCategory: "site",
                eventAction: "contactform",
                eventLabel: "submit",
                eventValue: "",
                event: "gaEvent",
            });

            popUpBlock.addEventListener("click", function (event) {
                let target = event.target;
                if (
                    target.classList.contains("popup-close") ||
                    target.classList.contains("popup-container")
                ) {
                    popUpBlock.classList.add("close");

                    popUpSuccess.classList.add("close");
                    popUpError.classList.add("close");
                    setTimeout(function () {
                        popUpBlock.classList.remove("open", "close");
                        popUpSuccess.classList.remove("open", "close");
                        popUpError.classList.remove("open", "close");
                    }, 200);
                    document.body.classList.remove("fixed");
                }
            });
        });
    });
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/contact-us";
</style>

<section id="contact-us-section" class="contact-us">
    <div class="container">
        <form id="contact-us" class="contact-form">
            <h2 class="title title-contact">contact us</h2>
            <input class="input" type="text" placeholder="Name" required />
            <input class="input" type="email" placeholder="Email" required />
            <textarea
                class="input input-message"
                placeholder="Message"
                required />
            <button class="btn btn-submit" type="submit">submit</button>
        </form>
    </div>
</section>

<Popup />
