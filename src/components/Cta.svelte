<script lang="ts">
    import IntersectionObserver from "svelte-intersection-observer";

    let element: any;
    let intersecting: boolean;
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/cta";
</style>

<IntersectionObserver threshold={0.1} {element} bind:intersecting once={true}>
    <section
        bind:this={element}
        class:intersecting
        class="cta"
        id="cta">
        <div class="container">
            <div class="cta-info">
                <h2 class="cta-text">Verify 10-100 emails for free!</h2>
                <a href="//app.mailcheck.co" class="btn btn-start">GET STARTED</a>
            </div>
        </div>
    </section>
</IntersectionObserver>
