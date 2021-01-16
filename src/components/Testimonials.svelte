<script>
    let slider;
    let active = false;
    let startX;
    let scrollLeft;


    function handleMouseDown(event) {
        console.log('Down');
        active = true;
        startX = event.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    function handleMouseUp(event) {
        active = false;
        console.log('up');
    }

    function handleMouseMove(event) {
        if (!active) return;
        event.preventDefault();
        const x = event.pageX - slider.offsetLeft;
        const SCROLL_SPEED = 1;
        const walk = (x - startX) * SCROLL_SPEED;
        console.log('move','event.pageX', event.pageX,'slider.offsetLeft', slider.offsetLeft, 'startX',startX,'scrollLeft',scrollLeft,'slider.scrollLeft',slider.scrollLeft,'walk',walk);
        slider.scrollLeft = scrollLeft - walk;
    }

</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/testimonials";
</style>

<section class="testimonials" id="testimonials">
    <div class="section-heading sm-left">
        <h2 class="title">TESTIMONIALS</h2>
        <p class="section-title-lg">TESTIMONIALS</p>
    </div>
    <div class="section-wrapper">
        <div class="testimonials-container">
            <div
                class="testimonials-wrapper"
                class:active={active}
                bind:this={slider}
                on:mousedown={handleMouseDown}
                on:mouseup={handleMouseUp}
                on:mouseleave={handleMouseUp}
                on:mousemove={handleMouseMove}
            >
                <div class="testimonial-slide">
                    <div class="slider-item">
                        <div class="slide-logo-wrapper">
                            <img
                                class="slide-logo"
                                src="assets/img/testimonials/bagllet.svg"
                                alt="Bagllet"/>
                        </div>
                        <p class="slide-text">
                            Been using Mailcheck for about 6 months now. Tried
                            other services before but decided to stay with
                            Mailcheck as these guys are truly doing what they
                            offer. I had a years old email list but after
                            running it through a verification never thought that
                            20% of it would come back as invalid! No wonder why
                            my sender score was so bad! Also, as an online-store
                            owner, I really enjoyed the benefits of their API
                            feature. And the cost..Absolutely worth it!
                        </p>
                        <p class="slide-name">Timofei G.</p>
                    </div>
                </div>
                <div class="testimonial-slide">
                    <div class="slider-item">
                        <div class="slide-logo-wrapper">
                            <img
                                class="slide-logo"
                                src="assets/img/testimonials/sammy-logo.svg"
                                alt="Sammy Icon"/>
                        </div>
                        <p class="slide-text">
                            "Probably one of the most comfortable validation
                            services, simple in use.
                        </p>
                        <p class="slide-name">Nick A.</p>
                    </div>
                </div>
                <div class="testimonial-slide">
                    <div class="slider-item">
                        <div class="slide-logo-wrapper">
                            <img
                                class="slide-logo"
                                src="assets/img/testimonials/5k-logo.svg"
                                alt="5000 miles"/>
                        </div>
                        <p class="slide-text">
                            Name of the brand popped my attention, I decided to
                            try because was planning to launch my marketing
                            campaign, some leads were outdated, didn't want to
                            blacklist my email account status and my domain, so
                            went to Mailcheck. I can say honestly these guys
                            kicking their A***s off to make sure their users
                            receive what they paid for. Highly recommend!!!
                        </p>
                        <p class="slide-name">Vadim С.</p>
                    </div>
                </div>
                <div class="testimonial-slide">
                    <div class="slider-item">
                        <div class="slide-logo-wrapper">
                            <img
                                class="slide-logo"
                                src="assets/img/testimonials/zitkani.svg"
                                alt="Zitkani"/>
                        </div>
                        <p class="slide-text">
                            The file I have checked have been accepted by
                            MailerLite, thank you! Your service did it better
                            than 2 others I have tried before.
                        </p>
                        <p class="slide-name">Claude I.</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Add Arrows -->
        <div
            class="testimonials-button testimonials-button-next"
        >
            <img src="assets/img/arrow-slide-nav.svg" alt="right"/>
        </div>
        <div
            class="testimonials-button testimonials-button-prev"
        >
            <img src="assets/img/arrow-slide-nav.svg" alt="left"/>
        </div>
    </div>
</section>

