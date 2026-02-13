<script lang="ts">
  import IntersectionObserver from 'svelte-intersection-observer';
  import iconLike from '$lib/Reviews/icon-like-heart.svg';
  import iconStar from '$lib/Reviews/icon-star-rating.svg';
  import iconProductHunt from '$lib/Reviews/logo-product-hunt.png?enhanced';
  import iconBeta from '$lib/Reviews/logo-beta-list.png?enhanced';
  import iconCapterra from '$lib/Reviews/logo-capterra.png?enhanced';

  let intersecting = $state(false);
  let element: HTMLElement | undefined = $state();
</script>

<IntersectionObserver {element} bind:intersecting once>
  <section class="reviews" class:intersecting bind:this={element}>
    <div class="section-heading">
      <h2 class="title">Our customer's reviews</h2>
      <p class="section-title-lg">Reviews</p>
    </div>
    <div class="container">
      <div class="section-wrapper sm-left">
        <div class="reviews-list">
          <div class="reviews-item">
            <enhanced:img
              width="170"
              height="40"
              src={iconProductHunt}
              alt=""
              class="reviews-item-logo"
            />
            <div class="reviews-item-rating">
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 1 star" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 2 stars" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 3 stars" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 4 stars" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 5 stars" />
            </div>
            <a
              href="/l/ph"
              target="_blank"
              rel="external nofollow"
              title="Read Reviews"
              class="reviews-item-link btn">Read Reviews</a
            >
          </div>
          <div class="reviews-item">
            <enhanced:img width="120" height="40" src={iconBeta} alt="" class="reviews-item-logo" />
            <div class="reviews-item-likes">
              <span class="rating-counter">11</span>
              <enhanced:img
                width="25"
                height="25"
                src={iconLike}
                alt=""
                class="reviews-like-icon"
              />
            </div>
            <a
              href="/l/betalist"
              target="_blank"
              rel="external nofollow"
              title="Read Reviews"
              class="reviews-item-link btn">Read Reviews</a
            >
          </div>
          <div class="reviews-item">
            <enhanced:img
              width="145"
              height="32"
              src={iconCapterra}
              alt=""
              class="reviews-item-logo"
            />
            <div class="reviews-item-rating">
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 1 star" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 2 stars" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 3 stars" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 4 stars" />
              <enhanced:img src={iconStar} width="25" height="25" alt="rating 5 stars" />
            </div>
            <a
              href="/l/capterra"
              target="_blank"
              rel="external nofollow"
              title="Read Reviews"
              class="reviews-item-link btn">Read Reviews</a
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</IntersectionObserver>

<style lang="scss">
  .reviews {
    @include intersection;
  }

  .reviews-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: var(--size-50);
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
    text-transform: uppercase;
    border: var(--size-1) solid var(--primary-white);

    &:visited {
      color: var(--primary-white);
    }
  }

  @media only screen and (max-width: 768px) {
    .reviews-list {
      flex-direction: column;
      margin-bottom: 0;
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
      flex-grow: 1;
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
      margin: 1rem auto;
      padding: var(--size-10) var(--size-24);
    }
  }
</style>
