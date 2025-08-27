<script lang="ts">
  import type { IPost } from '$utils/types';

  export let posts: IPost[] = [];
</script>

<div class="related">
  <h2 class="section-title uppercase">Related Posts</h2>
  {#each posts as { slug, title, snippet, thumbnail }}
    <div class="post">
      <img width="360" height="200" src={`${thumbnail}`} alt={title} />
      <div class="content">
        <h3 class="title uppercase">{title}</h3>
        <p class="description">{snippet}</p>
        <a href="/blog/{slug}" class="btn uppercase">read now</a>
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .related {
    padding-block: 16px;
    position: relative;
    z-index: 1;

    @media only screen and (min-width: 768px) {
      padding-block: 40px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      gap: 0 16px;
    }

    @media only screen and (max-width: 768px) {
      margin-inline: auto;
      width: min(100%, 370px);

      .post + .post {
        margin-top: 32px;
      }
    }

    .section-title {
      flex: 1 1 100%;
      color: var(--primary-white) !important;
      font-weight: var(--weight-700);
      font-size: var(--size-30);
      text-transform: uppercase;
    }

    .post {
      --card-space: 4px;
      padding: var(--card-space);
      flex: 1 1 calc(30% - var(--card-space));
      background-image: var(--card-bg-gradient);
      border-radius: var(--card-space);
      text-align: center;

      img {
        border-radius: var(--card-space);
      }

      .content {
        padding: 32px 16px;

        .title {
          margin: 0 0 10px;
          font-weight: var(--weight-400);
          font-size: var(--size-18);
          line-height: 1.4;
          text-align: left;
        }

        .description {
          margin: 0 0 25px;
          color: var(--primary-white);
          text-indent: initial;
          font-weight: var(--weight-300);
          font-size: var(--size-14);
          line-height: var(--size-20);
          letter-spacing: var(--letter-spacing);
          text-align: left;
          @include line-clamp(6);
        }

        .btn {
          color: var(--primary-white);
          background-color: var(--pricing-plan-agency);
          border-color: var(--pricing-plan-agency);

          &:active {
            color: var(--pricing-plan-agency);
            background: var(--transparent);
            border-color: var(--pricing-plan-border-agency);
          }
        }
      }
    }
  }
</style>
