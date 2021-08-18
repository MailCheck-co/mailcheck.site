<script lang="ts">
  import { onMount } from 'svelte';
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

  const loadClient = () => {
    const apiKey = process.env.VITE_YOUTUBE_API_KEY;
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

  onMount(() => {
    gapi = window && window.gapi;
    gapi && gapi.load('client');
    loadClient();
  });
</script>

<button on:click={loadClient} />

<main class="videos">
  <div class="slider">
    <Slider slides={videos} />
  </div>
  <div class="list">
    {#each videos as video}
      <div class="video">
        <Video id={video.id} title={video.title} />
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
    .slider {
      widows: 100%;
    }

    .list {
      display: flex;
      flex-flow: row wrap;

      .video {
        width: 45%;

        .description {
          h2 {
          }

          p {
          }
        }
      }
    }
  }
</style>
