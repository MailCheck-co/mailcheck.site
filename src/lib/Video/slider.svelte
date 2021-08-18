<script lang="ts">
    import { Slidy } from 'svelte-slidy';
    import Video from '$lib/Video/index.svelte';
  
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
        height: '12rem',
        padding: '0 0 1rem',
        align: 'top',
        alignmargin: 0
      },
      slide: {
        gap: 40,
        width: '18.75rem',
        height: '100%',
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
      <div class="video">
        <Video />
      </div>
      <div class="description">
        description
      </div>
    </div>
  </Slidy>
  
  <style lang="scss">
    :global(#slidy .slidy-ul) {
      z-index: 1;
    }
  
    :global(#slidy .slidy-ul li) {
      max-width: 15.4rem;
      height: 8rem;
      background-color: var(--color-white);
      border: none;
      border-radius: var(--br-8);
      box-shadow: var(--box-shadow);
      transition: height 0.2s, width 0.2s;
  
      @include font(var(--size-12), var(--weight-400), var(--color-text-dark));
    }
  
    :global(#slidy .slidy-ul li.active) {
      max-width: 18.75rem;
      height: 10.75rem;
      background: var(--color-card-bg);
      box-shadow: none;
  
      @include font(var(--size-16), var(--weight-400), var(--color-text-white));
    }
  
    :global(#slidy .slidy-ul li .slide) {
      position: relative;
      height: 100%;
      padding: var(--size-14);
    }
  
    :global(#slidy .slidy-ul li.active .slide) {
      position: relative;
      height: 100%;
      padding: var(--size-32) var(--size-12);
    }
  
    :global(#slidy .slidy-ul li .slide img) {
      position: absolute;
      right: var(--size-20);
      bottom: var(--size-22);
      width: 3.3rem;
      height: auto;
    }
  
    :global(#slidy .slidy-ul li.active .slide img) {
      right: var(--size-12);
      bottom: var(--size-16);
    }
  
    :global(#slidy .slidy-ul li .slide .summ) {
      position: absolute;
      bottom: var(--size-32);
      @include font(var(--size-20), var(--weight-700), var(--color-text-dark));
    }
  
    :global(#slidy .slidy-ul li.active .slide .summ) {
      color: var(--color-text-white);
    }
  
    :global(#slidy .slidy-dots) {
      bottom: 0;
      z-index: 2;
      height: var(--size-6);
    }
  
    :global(#slidy .slidy-dots li) {
      width: auto;
      height: auto;
    }
  
    :global(#slidy .slidy-dots li button) {
      width: var(--size-6);
      height: var(--size-6);
      margin: 0 var(--size-6);
      padding: 0;
      font-size: var(--size-zero);
      background: var(--color-text-light);
      border: none;
      border-radius: var(--br-rounded);
      transition: width 0.3s, background-color 0.3s, border-radius 0.3s;
    }
  
    :global(#slidy .slidy-dots li.active button) {
      background: var(--color-dark);
    }
  </style>
  