<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/popup";
</style>

<div class="popup-container" id="popup-block">
    <div class="popup" id="popup-success">
        <span class="popup-close success" id="close-success" />
        <span class="popup-thanks">Thanks for filling out our form!</span>
        <p class="popup-text">
            We will look over your message and get back to you by tomorrow. Your
            friends at MailCheck!
        </p>
    </div>
    <div class="popup" id="popup-error">
        <span class="popup-close error" id="close-error" />
        <span class="popup-thanks">Something went wrong!</span>
        <p class="popup-text">Please try again later</p>
    </div>
</div>
