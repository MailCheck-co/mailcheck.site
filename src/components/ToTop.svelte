<style>
  .button {
    position: fixed;
    right: 3%;
    bottom: 15%;
    background-color: #036;
    border-radius: 20px;
    z-index: 5;
    cursor: pointer;
    transition: all ease-out 0.2s;
    opacity: 0.7;
  }

  .button:hover {
    opacity: 1;
  }

  .button img {
    width: 50px;
    transform: rotate(-90deg) translateX(-8%);
  }
</style>

<script lang="ts">
  import { fade } from "svelte/transition";

  let currentPosition: number;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<svelte:window bind:scrollY="{currentPosition}" />

{#if currentPosition > 50}
  <div
    class="button"
    on:click="{scrollToTop}"
    transition:fade="{{ duration: 100 }}">
    <img
      src="assets/img/arrow-slide-nav.svg"
      width="50"
      height="50"
      alt="to top" />
  </div>
{/if}
