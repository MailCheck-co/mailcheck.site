<script>
    import Seo from '../components/seo.svelte';

    export let title;
    export let thumbnail;
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

<Seo title={`Blog | ${title}`} desc={title} thumbnail={thumbnail} isPost="true"/>

<div class="container" id="blog">
    <div class="content-block">
        <slot />
    </div>
</div>
