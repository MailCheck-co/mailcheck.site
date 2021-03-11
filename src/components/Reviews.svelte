<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/reviews";
</style>

<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement;
  let intersecting: boolean;
</script>

<IntersectionObserver
  threshold="{0.1}"
  element="{element}"
  bind:intersecting
  once="{true}">
  <section class="reviews" bind:this="{element}" class:intersecting>
    <div class="section-heading">
      <h2 class="title">Our customer's reviews</h2>
      <p class="section-title-lg">REVIEWS</p>
    </div>
    <div class="container">
      <div class="section-wrapper sm-left">
        <div class="reviews-list">
          <div class="reviews-item">
            <img
              width="170"
              height="40"
              src="assets/img/logo-product-hunt.png"
              alt=""
              class="reviews-item-logo" />
            <div class="reviews-item-rating">
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 1 star" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 2 stars" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 3 stars" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 4 stars" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 5 stars" />
            </div>
            <a
              href="https://www.producthunt.com/posts/mailcheck"
              target="_blank"
              rel="noopener nofollow"
              class="reviews-item-link btn">READ REVIEWS</a>
          </div>
          <div class="reviews-item">
            <img
              width="120"
              height="40"
              src="assets/img/logo-beta-list.png"
              alt=""
              class="reviews-item-logo" />
            <div class="reviews-item-likes">
              <span class="rating-counter">11</span>
              <img
                width="25"
                height="25"
                src="assets/img/icon-like-heart.svg"
                alt=""
                class="reviews-like-icon" />
            </div>
            <a
              href="https://betalist.com/startups/mailcheck"
              target="_blank"
              rel="noopener nofollow"
              class="reviews-item-link btn">READ REVIEWS</a>
          </div>
          <div class="reviews-item">
            <img
              width="145"
              height="32"
              src="assets/img/logo-capterra.png"
              alt=""
              class="reviews-item-logo" />
            <div class="reviews-item-rating">
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 1 star" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 2 stars" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 3 stars" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 4 stars" />
              <img
                src="assets/img/icon-star-rating.svg"
                width="25"
                height="25"
                alt="rating 5 stars" />
            </div>
            <a
              href="https://www.capterra.com/p/195397/Mailcheck/"
              target="_blank"
              rel="noopener nofollow"
              class="reviews-item-link btn">READ REVIEWS</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</IntersectionObserver>
