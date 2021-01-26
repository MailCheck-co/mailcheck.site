<script lang="ts">
    import IntersectionObserver from "svelte-intersection-observer";

    let element: any;
    let intersecting: boolean;
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/cta";
</style>

<IntersectionObserver {element} bind:intersecting>
    <section class="cta" bind:this={element} class:intersecting>
        <div class="container">
            <div class="cta-info">
                <h2 class="cta-text">Verify 10-100 emails for free!</h2>
                <a href="//app.mailcheck.co" class="btn btn-start">GET STARTED</a>
            </div>
        </div>
    </section>
</IntersectionObserver>
