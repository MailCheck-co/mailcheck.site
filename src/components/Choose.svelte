<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/choose-your";
</style>

<script lang="ts">
    import IntersectionObserver from "svelte-intersection-observer";

    let element: any;
    let intersecting: boolean;
</script>

<IntersectionObserver threshold={0.1} {element} bind:intersecting once>
    <section 
        bind:this={element} 
        class:intersecting
        class="choose-your"
        id="choose">
        <div class="container">
            <div class="section-heading sm-left">
                <h2 class="title">WHY DO YOU CHOOSE MAILCHECK?</h2>
                <p class="section-title-lg">YOU CAN</p>
            </div>
            <div class="wrapper-choose">
                <p class="text-thin art">
                    We are a team that validates emails and phones using social
                    networks for the past 3 years. Previously, we did it
                    manually and it took from 3 weeks to a year, but at the
                    moment it takes from us only 15 minutes to check 1 000 000
                    email addresses.
                </p>
                <p class="text-thin art">
                    Our service will be useful to those who are working every
                    day to increase conversion in email mailings and want to
                    decrease bounce rate. We will also be useful to those who
                    want to know who is behind that email or phone in order to
                    save their time and money.
                </p>
            </div>
        </div>
    </section>
</IntersectionObserver>
