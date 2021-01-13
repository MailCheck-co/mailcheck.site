<script>
    import { onMount } from "svelte";

    let shifted = false;
    onMount(() => {
        const items = document.getElementById("wrapper");
        const prev = document.getElementById("prev");
        const next = document.getElementById("next");
        let posX1 = 0;
        let posX2 = 0;
        let posInitial, posFinal;
        let threshold = 100;
        let index = 0;
        const slides = items.getElementsByClassName("testimonial-slide");
        const slideSize = slides[0].offsetWidth;

        function dragStart(e) {
            e = e || window.event;
            e.preventDefault();
            posInitial = items.offsetLeft;
            if (e.type == "touchstart") {
                posX1 = e.touches[0].clientX;
            } else {
                posX1 = e.clientX;
                document.onmouseup = dragEnd;
                document.onmousemove = dragAction;
            }
        }

        function dragAction(e) {
            e = e || window.event;
            if ((index != -1 && posX1 < e.clientX) || (index != 1 && posX1 > e.clientX)) {
                if (e.type == "touchmove") {
                    posX2 = posX1 - e.touches[0].clientX;
                    posX1 = e.touches[0].clientX;
                } else {
                    posX2 = posX1 - e.clientX;
                    posX1 = e.clientX;
                }
                items.style.left = `${items.offsetLeft - posX2}px`;
            }
        }

        function dragEnd(e) {
            posFinal = items.offsetLeft;
            if (posFinal - posInitial < -threshold) {
                shiftSlide(1, "drag");
            } else if (posFinal - posInitial > threshold) {
                shiftSlide(-1, "drag");
            } else {
                items.style.left = `${posInitial}px`;
            }
            document.onmouseup = null;
            document.onmousemove = null;
        }

        function shiftSlide(dir, action) {
            shifted = true;
            if (!action) {
                posInitial = items.offsetLeft;
            }
            if (dir === 1 && index !== 1) { // next
                items.style.left = `${posInitial - slideSize - 20}px`;
                index++;
            } else if (dir === -1 && index !== -1) { // prev
                items.style.left = `${posInitial + slideSize + 20}px`;
                index--;
            }
        }

        function clearing() {
            shifted = false;
        }

        items.onmousedown = dragStart;
        items.addEventListener("touchstart", dragStart);
        items.addEventListener("touchend", dragEnd);
        items.addEventListener("touchmove", dragAction);
        prev.addEventListener("click", () => shiftSlide(-1));
        next.addEventListener("click", () => shiftSlide(1));
        items.addEventListener("transitionend", clearing);
    });
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
        <!-- TESTIMONIALS -->
        <div class="testimonials-container" id="slider">
            <div class="testimonials-wrapper" id="wrapper" class:shifted={shifted}>
                <div class="testimonial-slide">
                    <div class="slider-item">
                        <div class="slide-logo-wrapper">
                            <img
                                class="slide-logo"
                                src="assets/img/testimonials/bagllet.svg"
                                alt="Bagllet" />
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
                                alt="Sammy Icon" />
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
                                alt="5000 miles" />
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
                                alt="Zitkani" />
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
        <div class="testimonials-button testimonials-button-next" id="next">
            <img src="assets/img/arrow-slide-nav.svg" alt="right" />
        </div>
        <div class="testimonials-button testimonials-button-prev" id="prev">
            <img src="assets/img/arrow-slide-nav.svg" alt="left" />
        </div>
    </div>
</section>

<!-- on:click={onPrev}  -->
<!-- on:click={onNext} -->
