<script lang="ts">
    export let status: number;

    import Header from "../components/Header.svelte";
    import Footer from "../components/Footer.svelte";
    import { onMount } from "svelte";

    /**
     * Sometimes, we see that the chunk URL has changed and that
     * results in a 500 error (when we've deployed a new version)
     * In that case, simply refreshing the page works, so we do that
     * But we don't want to get stuck in a loop, so we only do it once
     */
    onMount(() => {
        if (typeof window !== "undefined" && "sessionStorage" in window && status !== 404) {
        if (!window.sessionStorage.getItem("sapper-has-refreshed")) {
            window.sessionStorage.setItem("sapper-has-refreshed", "1");
            window.location.reload();
        }
        }
    });
</script>

<style lang="scss" global>
  @import "../scss/styles";
</style>

<Header />

<slot />

<Footer />
