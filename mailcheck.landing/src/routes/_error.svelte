<script lang="ts">
	export let status: number;
	export let error: Error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<svelte:head>
	<title>Mailcheck | {status}</title>
</svelte:head>

<main class="terms" id="terms">
    <div class="container">
        <div class="wrapper-choose">
            <h1 class="title">{status}</h1>
            <input class="read-more-checkbox" type="checkbox" id="read-more">
            <p class="text-thin art">{error.message}</p>
            <p class="text-thin art">You will be redirected to main site in 10 seconds</p>
            <label class="read-more-label" for="read-more"></label>
        </div>
    </div>
</main>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if}
