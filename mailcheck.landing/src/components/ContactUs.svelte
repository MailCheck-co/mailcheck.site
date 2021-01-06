<script>
    import Popup from "./Popup.svelte";
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
