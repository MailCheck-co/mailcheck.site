<script lang="ts">
  import IntersectionObserver from 'svelte-intersection-observer';
  import k5Logo from '$lib/Testimonials/5k-logo.svg';
  import baglletLogo from '$lib/Testimonials/bagllet.svg';
  import sammyLogo from '$lib/Testimonials/sammy-logo.svg';
  import zitkaniLogo from '$lib/Testimonials/zitkani.svg';
  import echoLogo from '$lib/Testimonials/echo-logo.svg';
  import arrowNav from '$lib/Testimonials/arrow-slide-nav.svg';

  let intersecting = $state(false);
  let element: HTMLElement | undefined = $state();
  let slider = $state<HTMLElement>();
  let active = $state(false);
  let scrollLeft = $state(0);
  const SCROLL_SPEED = 4; // DON'T CHANGE!!!
  const ITEMS_TO_SCROLL = 1;
  const SCROLL = ITEMS_TO_SCROLL * 420;
  const TIMEOUT = SCROLL_SPEED * 100;

  function deactivate(e: MouseEvent | PointerEvent) {
    setTimeout(() => {
      active = false;
      if (e.target && (e.target as HTMLElement).style) {
        (e.target as HTMLElement).style.pointerEvents = 'auto';
      }
    }, TIMEOUT);
  }

  function onPrev(e: MouseEvent | PointerEvent) {
    if (e.target && (e.target as HTMLElement).style)
      (e.target as HTMLElement).style.pointerEvents = 'none';
    active = true;
    if (slider) {
      scrollLeft = slider.scrollLeft;
      slider.scrollLeft = scrollLeft - SCROLL;
    }
    deactivate(e);
  }

  function onNext(e: MouseEvent | PointerEvent) {
    if (e.target && (e.target as HTMLElement).style)
      (e.target as HTMLElement).style.pointerEvents = 'none';
    active = true;
    if (slider) {
      scrollLeft = slider.scrollLeft;
      slider.scrollLeft = scrollLeft + SCROLL;
    }
    deactivate(e);
  }
</script>

<IntersectionObserver {element} bind:intersecting once>
  <section class="testimonials" class:intersecting bind:this={element}>
    <div class="section-heading sm-left">
      <h2 class="title">Testimonials</h2>
      <p class="section-title-lg">Testimonials</p>
    </div>
    <div class="section-wrapper">
      <div class="testimonials-container">
        <ul class="testimonials-wrapper" class:active bind:this={slider}>
          <li class="testimonial-slide">
            <div class="slider-item">
              <div class="slide-logo-wrapper">
                <img width="119" height="94" class="slide-logo" src={baglletLogo} alt="Bagllet" />
              </div>
              <p class="slide-text">
                Been using Mailcheck for about 6 months now. Tried other services before but decided
                to stay with Mailcheck as these guys are truly doing what they offer. I had a years
                old email list but after running it through a verification never thought that 20% of
                it would come back as invalid! No wonder why my sender score was so bad! Also, as an
                online-store owner, I really enjoyed the benefits of their API feature. And the
                cost.. Absolutely worth it!
              </p>
              <p class="slide-name">Timofei G.</p>
            </div>
          </li>
          <li class="testimonial-slide">
            <div class="slider-item">
              <div class="slide-logo-wrapper">
                <img width="94" height="94" class="slide-logo" src={sammyLogo} alt="Sammy Icon" />
              </div>
              <p class="slide-text">
                "Probably one of the most comfortable validation services, simple in use.
              </p>
              <p class="slide-name">Nick A.</p>
            </div>
          </li>
          <li class="testimonial-slide">
            <div class="slider-item">
              <div class="slide-logo-wrapper">
                <img width="94" height="94" class="slide-logo" src={k5Logo} alt="5000 miles" />
              </div>
              <p class="slide-text">
                Name of the brand popped my attention, I decided to try because was planning to
                launch my marketing campaign, some leads were outdated, didn't want to blacklist my
                email account status and my domain, so went to Mailcheck. I can say honestly these
                guys kicking their A***s off to make sure their users receive what they paid for.
                Highly recommend!!!
              </p>
              <p class="slide-name">Vadim С.</p>
            </div>
          </li>
          <li class="testimonial-slide">
            <div class="slider-item">
              <div class="slide-logo-wrapper">
                <img width="150" height="88" class="slide-logo" src={zitkaniLogo} alt="Zitkani" />
              </div>
              <p class="slide-text">
                The file I have checked have been accepted by MailerLite, thank you! Your service
                did it better than 2 others I have tried before.
              </p>
              <p class="slide-name">Claude I.</p>
            </div>
          </li>
          <li class="testimonial-slide">
            <div class="slider-item">
              <div class="slide-logo-wrapper">
                <img width="150" height="88" class="slide-logo" src={echoLogo} alt="ECHO" />
              </div>
              <p class="slide-text">
                So far, the best mail validation service we tried. It doesn’t rely only on mx check
                (as the majority of cleaning tool does) but it retrieve data from social networks
                and many other sources to assign a score to a specific mail. Customer service is
                great. Very happy with Mailcheck
              </p>
              <p class="slide-name">Francesco E.</p>
            </div>
          </li>
        </ul>
      </div>
      <button
        class="testimonials-button testimonials-button-next"
        onclick={onNext}
        aria-label="Next slide"
      >
        <img src={arrowNav} width="20" height="20" alt="right" />
      </button>
      <button
        class="testimonials-button testimonials-button-prev"
        onclick={onPrev}
        aria-label="Previous slide"
      >
        <img src={arrowNav} width="20" height="20" alt="left" />
      </button>
    </div>
  </section>
</IntersectionObserver>

<style lang="scss">
  .testimonials {
    @include intersection;

    color: var(--primary-white);
  }

  .section-wrapper {
    position: relative;
  }

  .testimonials-container {
    position: relative;
    z-index: 1;
    width: 100%;
    overflow: hidden;
  }

  .testimonials-wrapper {
    display: grid;
    grid-gap: 1rem;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(5, 26.25rem);
    height: 23.75rem;
    margin-left: var(--size-10);
    padding: 0;
    overflow-x: scroll;
    touch-action: manipulation;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scroll-padding: 1rem;
    scrollbar-width: none;
    scrollbar-color: var(--transparent);

    &.active {
      scroll-snap-type: unset;
      scroll-behavior: smooth;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .testimonial-slide {
    display: inline-block;
    width: 26.25rem;
    height: 23.75rem;
    font-size: var(--size-0);
    border-radius: var(--br-3);
    scroll-snap-align: start;
  }

  .slider-item {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    height: 20rem;
    padding: var(--size-30);
    background: url('./testimonial-slides-img.png') var(--gradient-4) no-repeat top 10% right 10%;
    border-radius: var(--size-6);
  }

  .slide-logo-wrapper {
    display: flex;
    align-items: center;
    height: 5.875rem;
    overflow: hidden;
  }

  .slide-logo {
    max-width: var(--size-150);
    max-height: 100%;
    padding: var(--size-6);
    text-align: center;
  }

  .slide-text {
    max-height: 8.125rem;
    margin-bottom: auto;
    padding-right: var(--size-16);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0.3em;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--section-titles-color);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-accent);
      border: var(--size-2) solid var(--primary-accent);
      border-radius: var(--size-6);
    }
  }

  .slide-text,
  .slide-name {
    color: var(--primary-white);
    font-weight: var(--weight-400);
    font-size: var(--size-14);
    line-height: 1.714;
    text-align: left;
    text-indent: initial;
  }

  .slide-name {
    color: var(--primary-accent);
    font-style: italic;
  }

  .testimonials-button {
    position: absolute;
    top: 50%;
    width: var(--size-20);
    height: var(--size-20);
    transform: translateY(-50%);
    cursor: pointer;

    &-prev {
      left: -5%;

      & > img {
        transform: rotate(-180deg);
      }
    }

    &-next {
      right: -5%;
    }
  }

  @media all and (max-width: 768px) {
    .testimonials {
      .testimonials-container {
        &::before,
        &::after {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 9;
          display: block;
          width: 20%;
          height: 100%;
          content: '';
          pointer-events: none;
        }

        &::before {
          left: 0;
          background-image: var(--slider-overlay-gradient-left);
        }

        &::after {
          right: 0;
          background-image: var(--slider-overlay-gradient-right);
        }
      }

      .testimonials-wrapper {
        padding: 0;
      }

      .slider-item {
        padding: var(--size-30) 6.25rem;
      }

      .testimonials-button {
        z-index: 10;

        &-prev {
          left: 5%;
        }

        &-next {
          right: 5%;
        }
      }
    }
  }
</style>
