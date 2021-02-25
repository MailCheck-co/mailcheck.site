<script lang="ts">
    import IntersectionObserver from "svelte-intersection-observer";

    let element: any;
    let intersecting: boolean;
    let intersected: boolean = false;
    const onIntersect = event => {
        const id = event.detail.target.id;
        if (!!intersecting && !intersected && id === element.id) {
            intersected = true;
        }
    };
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/cta";
</style>

<IntersectionObserver threshold={0.1} {element} bind:intersecting on:observe|once={onIntersect}>
    <section
        bind:this={element}
        class:intersecting
        class:intersected
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
