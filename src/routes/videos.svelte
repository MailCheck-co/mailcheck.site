<script lang="ts">
  import { onMount } from 'svelte';
  import { apiKey } from '$lib/Video/key';
  import Video from '$lib/Video/index.svelte';
  import Slider from '$lib/Video/slider.svelte';

  interface IVideo {
    id: string;
    title: string;
    desc: string;
  }

  let videos: IVideo[] = [];
  let gapi: {
    load: (arg0: string) => any;
    client: {
      setApiKey: (arg0: string) => any;
      load: (arg0: string) => Promise<any>;
      youtube: {
        playlistItems: {
          list: (arg0: { part: string[]; maxResults: number; playlistId: string }) => Promise<any>;
        };
      };
    };
  };

  onMount(() => {
    gapi = window.gapi;
    gapi.load('client');
    const load = setTimeout(() => {
      loadClient();
      clearTimeout(load);
    }, 1000);
  });

  const loadClient = () => {
    gapi.client.setApiKey(apiKey);

    return gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest').then(
      () => {
        return gapi.client.youtube.playlistItems
          .list({
            part: ['snippet'],
            maxResults: 10,
            playlistId: 'PLI3Dd_Z__sqcUmD8MaIFMIVnfEvTtyPZg'
          })
          .then(
            (response) => {
              const items = response.result.items;
              videos = items.map((video: any) => {
                return {
                  id: video.snippet.resourceId.videoId,
                  title: video.snippet.title,
                  desc: video.snippet.description
                };
              });
            },
            (err) => console.error('Execute error', err)
          );
      },
      (err) => {
        console.error('Error loading GAPI client for API', err);
      }
    );
  };
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
