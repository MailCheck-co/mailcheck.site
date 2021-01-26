<script>
    import { onMount } from "svelte";
    import SEO from '../components/SEO.svelte';
    import placeholder from '../../static/android-chrome-36x36.png';

    export let title;
    export let snippet;
    let img;

    onMount(() => {
        const blog = document.getElementById('blog');
        img = blog.querySelector('img');
    });
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

<SEO {title} {snippet} thumbnail={img || placeholder} />

<div class="container" id="blog">
    <div class="content-block">
        <slot />
    </div>
</div>
