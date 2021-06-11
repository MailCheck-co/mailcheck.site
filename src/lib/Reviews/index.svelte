<script lang="ts">
  let element: HTMLElement;
</script>

<section class="reviews" bind:this={element}>
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
            <img src="assets/img/icon-star-rating.svg" width="25" height="25" alt="rating 1 star" />
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
            <img src="assets/img/icon-star-rating.svg" width="25" height="25" alt="rating 1 star" />
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

<style lang="scss">
  .reviews {
    .reviews-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8.125rem;
    }

    .reviews-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .reviews-item-logo {
      max-width: 100%;
      margin-bottom: var(--size-20);
    }

    .reviews-item-rating {
      display: flex;
      align-items: center;
      justify-content: center;

      & > img {
        width: 100%;
        max-width: var(--size-24);
        height: var(--size-24);
      }
    }

    .reviews-item-rating,
    .reviews-like-icon {
      width: auto;
      max-height: var(--size-24);
      margin-bottom: var(--size-40);
    }

    .reviews-item-likes {
      display: flex;
      justify-content: center;
    }

    .rating-counter {
      margin-right: var(--size-6);
      color: var(--primary-accent);
      font-weight: var(--weight-900);
      font-size: var(--size-32);
      line-height: var(--size-24);
      text-align: center;
      text-transform: uppercase;
    }

    .reviews-item-link {
      white-space: nowrap;
      border: 0.08rem solid var(--primary-white);

      &:visited {
        color: var(--primary-white);
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .reviews-list {
      flex-direction: column;
      margin-bottom: 4.375rem;
    }

    .reviews-item {
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      margin-bottom: var(--size-18);
    }

    .reviews-item-logo {
      width: 25%;
      margin-right: var(--size-16);
      margin-bottom: 0;
    }

    .reviews-item-rating,
    .reviews-item-likes {
      margin-bottom: 0;
    }

    .reviews-item-rating {
      & > img {
        width: 13%;
      }
    }

    .reviews-like-icon {
      width: 13%;
      margin-bottom: 0;
    }

    .rating-counter {
      font-size: var(--size-14);
    }

    .reviews-item-link {
      margin-left: auto;
      padding: var(--size-10) var(--size-24);
    }
  }
</style>
