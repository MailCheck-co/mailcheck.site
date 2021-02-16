<script>
    import IntersectionObserver from "svelte-intersection-observer";

    let element;
    let intersecting;
    let slider;
    let active = false;
    let startX;
    let scrollLeft;
    const SCROLL_SPEED = 4; // DON'T CHANGE!!!
    const ITEMS_TO_SCROLL = 1;
    const SCROLL = ITEMS_TO_SCROLL * 420;
    const TIMEOUT = SCROLL_SPEED * 100;

    function deactivate() {
        setTimeout(() => {
            active = false;
        }, TIMEOUT);
    }

    function onPrev() {
        active = true;
        scrollLeft = slider.scrollLeft;
        slider.scrollLeft = scrollLeft - SCROLL;
        deactivate();
    }

    function onNext() {
        active = true;
        scrollLeft = slider.scrollLeft;
        slider.scrollLeft = scrollLeft + SCROLL;
        deactivate();
    }

    function onMouseDown(e) {
        active = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    function onMouseUp() {
        active = false;
    }

    function onMouseMove(e) {
        if (!active) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * SCROLL_SPEED;
        slider.scrollLeft = scrollLeft - walk;
    }
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/testimonials";
</style>

<IntersectionObserver threshold={0.1} {element} bind:intersecting>
    <section class="testimonials" bind:this={element} class:intersecting>
        <div class="section-heading sm-left">
            <h2 class="title">TESTIMONIALS</h2>
            <p class="section-title-lg">TESTIMONIALS</p>
        </div>
        <div class="section-wrapper">
            <div class="testimonials-container">
                <ul
                    class="testimonials-wrapper"
                    class:active
                    bind:this={slider}
                    on:mousedown={onMouseDown}
                    on:mouseup={onMouseUp}
                    on:mouseleave={onMouseUp}
                    on:mousemove={onMouseMove}>
                    <li class="testimonial-slide">
                        <div class="slider-item">
                            <div class="slide-logo-wrapper">
                                <img
                                    class="slide-logo"
                                    src="assets/img/testimonials/bagllet.svg"
                                    alt="Bagllet" />
                            </div>
                            <p class="slide-text">
                                Been using Mailcheck for about 6 months now.
                                Tried other services before but decided to stay
                                with Mailcheck as these guys are truly doing
                                what they offer. I had a years old email list
                                but after running it through a verification
                                never thought that 20% of it would come back as
                                invalid! No wonder why my sender score was so
                                bad! Also, as an online-store owner, I really
                                enjoyed the benefits of their API feature. And
                                the cost..Absolutely worth it!
                            </p>
                            <p class="slide-name">Timofei G.</p>
                        </div>
                    </li>
                    <li class="testimonial-slide">
                        <div class="slider-item">
                            <div class="slide-logo-wrapper">
                                <img
                                    class="slide-logo"
                                    src="assets/img/testimonials/sammy-logo.svg"
                                    alt="Sammy Icon" />
                            </div>
                            <p class="slide-text">
                                "Probably one of the most comfortable validation
                                services, simple in use.
                            </p>
                            <p class="slide-name">Nick A.</p>
                        </div>
                    </li>
                    <li class="testimonial-slide">
                        <div class="slider-item">
                            <div class="slide-logo-wrapper">
                                <img
                                    class="slide-logo"
                                    src="assets/img/testimonials/5k-logo.svg"
                                    alt="5000 miles" />
                            </div>
                            <p class="slide-text">
                                Name of the brand popped my attention, I decided
                                to try because was planning to launch my
                                marketing campaign, some leads were outdated,
                                didn't want to blacklist my email account status
                                and my domain, so went to Mailcheck. I can say
                                honestly these guys kicking their A***s off to
                                make sure their users receive what they paid
                                for. Highly recommend!!!
                            </p>
                            <p class="slide-name">Vadim С.</p>
                        </div>
                    </li>
                    <li class="testimonial-slide">
                        <div class="slider-item">
                            <div class="slide-logo-wrapper">
                                <img
                                    class="slide-logo"
                                    src="assets/img/testimonials/zitkani.svg"
                                    alt="Zitkani" />
                            </div>
                            <p class="slide-text">
                                The file I have checked have been accepted by
                                MailerLite, thank you! Your service did it
                                better than 2 others I have tried before.
                            </p>
                            <p class="slide-name">Claude I.</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div
                class="testimonials-button testimonials-button-next"
                on:click={onNext}>
                <img src="assets/img/arrow-slide-nav.svg" alt="right" />
            </div>
            <div
                class="testimonials-button testimonials-button-prev"
                on:click={onPrev}>
                <img src="assets/img/arrow-slide-nav.svg" alt="left" />
            </div>
        </div>
    </section>
</IntersectionObserver>
