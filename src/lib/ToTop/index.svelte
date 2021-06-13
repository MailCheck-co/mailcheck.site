<script lang="ts">
  import { fade } from 'svelte/transition';

  let currentPosition: number;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
</script>

<svelte:window bind:scrollY={currentPosition} />

{#if currentPosition > 50}
  <div class="button" on:click={scrollToTop} transition:fade={{ duration: 100 }}>
    <img src="/assets/img/arrow-slide-nav.svg" width="50" height="50" alt="to top" />
  </div>
{/if}

<style lang="scss">
  .button {
    position: fixed;
    right: 3%;
    bottom: 7rem;
    z-index: 5;
    background-color: var(--midnight-blue);
    border-radius: var(--size-20);
    cursor: pointer;
    opacity: 0.7;
    transition: all ease-out 0.2s;
  }

  .button:hover {
    opacity: 1;
  }

  .button img {
    width: var(--size-50);
    transform: rotate(-90deg) translateX(-8%);
  }
</style>
