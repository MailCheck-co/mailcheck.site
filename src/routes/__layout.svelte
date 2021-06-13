<script lang="ts">
  import Header from '$lib/Header/index.svelte';
  import '../app.scss';
</script>

<Header>
  <main>
    <slot />
  </main>

  <footer>
    <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
  </footer>

  <style>
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      width: 100%;
      max-width: 64rem;
      margin: 0 auto;
      box-sizing: border-box;
    }

    footer {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: var(--size-40);
    }

    footer a {
      font-weight: var(--weight-700);
    }

    @media (min-width: 480px) {
      footer {
        padding: var(--size-40) 0;
      }
    }
  </style>
</Header>
<slot />
