<script lang="ts">
    import IntersectionObserver from "svelte-intersection-observer";

    let element: any;
    let intersecting: boolean;
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/cost";
</style>

<IntersectionObserver {element} bind:intersecting>
    <section bind:this={element} class:intersecting class="cost-effective" id="pricing">
        <div class="section-heading sm-left">
            <h2 class="title">Cost-effective pricing plans</h2>
            <p class="section-title-lg">PRICING</p>
            <p class="section-subtitle">Choose wisely.</p>
        </div>
        <div class="wrapper-cost">
            <div class="container cards">
                <div class="card" id="pro">
                    <h3 class="title-colored">pro</h3>
                    <span class="title lowercase">$10/mo</span>
                    <span class="card-features-text">
                        1,000 emails to validate included</span>
                    <span class="card-features-text">
                        $0.005/1 mail overage charge</span>
                    <a
                        href="//app.mailcheck.co/dashboard/payment_plans"
                        class="btn btn-choose">choose</a>
                </div>
                <div class="card" id="agency">
                    <h3 class="title-colored cyan">agency</h3>
                    <span class="title lowercase">$30/mo</span>
                    <span class="card-features-text">
                        5,000 emails to validate included</span>
                    <span class="card-features-text">
                        $0.004/1 mail overage charge</span>
                    <a
                        href="//app.mailcheck.co/dashboard/payment_plans"
                        class="btn btn-choose btn-cyan">choose</a>
                </div>
                <div class="card" id="enterprise">
                    <h3 class="title-colored grey">enterprise</h3>
                    <span class="title lowercase">$90/mo</span>
                    <span class="card-features-text">
                        20,000 emails to validate included</span>
                    <span class="card-features-text">
                        $0.003/1 mail overage charge</span>
                    <a
                        href="//app.mailcheck.co/dashboard/payment_plans"
                        class="btn btn-choose btn-grey">choose</a>
                </div>
                <div class="card" id="custom">
                    <h3 class="title-colored red">custom</h3>
                    <span class="card-features-text">
                        <span class="bold">EPIC</span>
                        100,000+ emails to validate included</span>
                    <span class="card-features-text">
                        <span class="bold">LEGENDARY</span>
                        1,000,000,000+ emails to validate included</span>
                    <a
                        href="//app.mailcheck.co/dashboard/payment_plans"
                        class="btn btn-choose btn-red">choose</a>
                </div>
            </div>
        </div>
    </section>
</IntersectionObserver>
