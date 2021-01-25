<script>
    export let title;
    export let slug;
</script>

<style>
    .container {
        display: block;
        box-sizing: border-box;
        width: 100%;
        min-width: 320px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 30px;
    }

    .content-block {
        display: flex;
        flex-direction: column;
        max-width: 880px;
        margin: 0 auto 100px;
    }
</style>

<svelte:head>
    <title>Mailcheck | Blog | {title}</title>
    <link rel="canonical" href={`https://www.mailcheck.co/blog/${slug}`} >
</svelte:head>

<div class="container">
    <div class="content-block">
        <slot />
    </div>
</div>
