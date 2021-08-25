<script lang="ts">
  import { Slidy } from 'svelte-slidy';
  import Video from '$lib/Video/video.svelte';

  interface ISlide {
    id: string;
    title: string;
    desc: string;
  }

  export let slides: ISlide[];
  let index: number;
  let init = false;
  $: init && (index = 1);

  const slidy = {
    slides: slides,
    timeout: 1000, // loading timeout
    wrap: {
      id: 'slidy',
      width: '100%',
      height: '',
      padding: '0',
      align: 'top',
      alignmargin: 0
    },
    slide: {
      gap: 40,
      width: '100%',
      height: '',
      backimg: false,
      imgsrckey: 'src',
      objectfit: 'contain',
      overflow: 'hidden'
    },
    controls: {
      dots: true,
      dotsnum: false,
      dotsarrow: false,
      dotspure: true,
      arrows: false,
      keys: true,
      drag: true,
      wheel: true
    },
    options: {
      axis: 'x',
      loop: true,
      duration: 200
    }
  };
</script>

<Slidy {...slidy} bind:init bind:index let:item>
  <div class="slide">
    <div class="video-wrapper">
      <Video id={item.id} title={item.title} />
    </div>
    <div class="description">
      <h2>{item.title}</h2>
      <p>{item.desc}</p>
    </div>
  </div>
</Slidy>

<style lang="scss">
  :global(.slidy) {
    height: 100%;
  }

  :global(.slidy .slidy-ul) {
    z-index: 1;
  }

  :global(.slidy .slidy-ul li) {
    height: 100%;
  }

  :global(.slidy .slidy-ul li .slide) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.slidy .slidy-ul li .slide .video-wrapper) {
    max-height: 22rem;
    max-width: 40rem;
    width: 100%;
    flex: 1 0 100%;
    background-color: var(--primary-white);
    border-radius: var(--br-10);
    overflow: hidden;
  }

  :global(.slidy .slidy-ul li .slide .description) {
    width: 100%;
    flex: 1 0 100%;
    padding: var(--size-20);
  }

  :global(.slidy .slidy-ul li .slide .description h2) {
    line-height: 1.2;
    text-align: center;
    text-indent: initial;
    letter-spacing: normal;
    font-weight: var(--weight-700);
    font-size: var(--size-20);
    color: var(--primary-white);
  }

  :global(.slidy .slidy-ul li .slide .description p) {
    color: var(--primary-white);
    font-weight: var(--weight-500);
    text-indent: initial;
    text-align: center;
  }

  :global(.slidy .slidy-dots) {
    bottom: 0;
    z-index: 2;
    height: var(--size-16);
  }

  :global(.slidy .slidy-dots li) {
    width: auto;
    height: auto;
  }

  :global(.slidy .slidy-dots li button) {
    width: var(--size-10);
    height: var(--size-10);
    margin: 0 var(--size-6);
    padding: 0;
    font-size: var(--size-zero);
    background: var(--primary-white);
    border: none;
    border-radius: var(--br-rounded);
    opacity: 0.8;
    transition: width 0.3s, height 0.3s, opacity 0.3s;
  }

  :global(.slidy .slidy-dots li.active button) {
    width: var(--size-16);
    height: var(--size-16);
    opacity: 1;
  }

  @media all and (min-width: 992px) {
    :global(.slidy) {
      height: 25rem;
    }

    :global(.slidy .slidy-ul li) {
      height: 24rem;
    }

    :global(.slidy .slidy-ul li .slide) {
      flex-direction: row;
    }

    :global(.slidy .slidy-ul li .slide .video-wrapper) {
      width: 60%;
      flex: 0 0 60%;
    }

    :global(.slidy .slidy-ul li .slide .description) {
      width: 40%;
      flex: 0 0 40%;
    }

    :global(.slidy .slidy-ul li .slide .description h2) {
      text-align: left;
    }

    :global(.slidy .slidy-ul li .slide .description p) {
      text-align: left;
    }
  }
</style>
