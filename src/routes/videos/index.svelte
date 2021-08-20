<script lang="ts" context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ fetch }) {
    const videos = await fetch('videos.json')
      .then((res: Response) => res.json());
    return {
      props: {
        videos
      }
    };
  };
</script>

<script lang="ts">
  import Video from '$lib/Video/video.svelte';
  import Slider from '$lib/Video/slider.svelte';

  interface IVideo {
    id: string;
    title: string;
    desc: string;
  }

  export let videos: IVideo[];
</script>

<main class="videos">
  <div class="slider">
    <Slider slides={videos} />
  </div>
  <div class="list">
    {#each videos as video}
      <div class="content">
        <div class="video-wrapper">
          <Video id={video.id} title={video.title} />
        </div>
        <div class="description">
          <h2>{video.title}</h2>
          <p>{video.desc}</p>
        </div>
      </div>
    {/each}
  </div>
</main>

<style lang="scss">
  .videos {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 320px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--size-30);

    .slider {
      width: 100%;
    }

    .list {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      min-height: var(--size-880);

      .content {
        width: 45%;

        %text {
          color: var(--primary-white);
          line-height: 1.2;
          text-align: left;
          text-indent: initial;
        }

        .video-wrapper {
          position: relative;
          background-color: var(--primary-white);
          border-radius: var(--br-10);
          overflow: hidden;
          z-index: 1;
        }

        .description {
          h2 {
            @extend %text;
            font-weight: var(--weight-700);
            font-size: var(--size-20);
          }

          p {
            @extend %text;
            font-weight: var(--weight-400);
            font-size: var(--size-14);
          }
        }
      }
    }
  }
</style>
