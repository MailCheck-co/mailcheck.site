<script lang="ts">
  import { spring } from 'svelte/motion';

  let count = 0;

  const displayed_count = spring();
  $: displayed_count.set(count);
  $: offset = modulo($displayed_count, 1);

  function modulo(n: number, m: number) {
    // handle negative numbers
    return ((n % m) + m) % m;
  }
</script>

<div class="counter">
  <button on:click={() => (count -= 1)} aria-label="Decrease the counter by one">
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5" />
    </svg>
  </button>

  <div class="counter-viewport">
    <div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
      <strong style="top: -100%" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
      <strong>{Math.floor($displayed_count)}</strong>
    </div>
  </div>

  <button on:click={() => (count += 1)} aria-label="Increase the counter by one">
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
    </svg>
  </button>
</div>

<style>
  .counter {
    display: flex;
    border-top: 0.08rem solid rgba(0, 0, 0, 0.1);
    border-bottom: 0.08rem solid rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
  }

  .counter button {
    width: 2em;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: transparent;
    color: var(--text-color);
    font-size: var(--size-32);
  }

  .counter button:hover {
    background-color: var(--secondary-color);
  }

  svg {
    width: 25%;
    height: 25%;
  }

  path {
    vector-effect: non-scaling-stroke;
    stroke-width: var(--size-2);
    stroke: var(--text-color);
  }

  .counter-viewport {
    width: 8em;
    height: 4em;
    overflow: hidden;
    text-align: center;
    position: relative;
  }

  .counter-viewport strong {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    font-weight: var(--weight-400);
    color: var(--accent-color);
    font-size: var(--size-64);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .counter-digits {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
