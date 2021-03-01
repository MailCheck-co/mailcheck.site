<style lang="scss">
  @import "../scss/utilities/index";
  @import "../scss/molecules/header";
  @import "../scss/molecules/mobile-menu";
</style>

<script lang="ts">
  export let status: number;

  import { onMount } from "svelte";
  import ToTop from "./ToTop.svelte";

  let open = false;
  let lang = "en";
  const onLangSelect = (e) => {
    const current = e.target.options.selectedIndex;
    switch (+current) {
      case 0:
        lang = "en";
        break;
      case 1:
        lang = "es";
        break;
      case 2:
        lang = "ru";
        break;
      default:
        lang = "en";
        break;
    }
  };

  /**
   * Sometimes, we see that the chunk URL has changed and that
   * results in a 500 error (when we've deployed a new version)
   * In that case, simply refreshing the page works, so we do that
   * But we don't want to get stuck in a loop, so we only do it once
   */
  onMount(() => {
    if (
      typeof window !== "undefined" &&
      "sessionStorage" in window &&
      status !== 404
    ) {
      if (!window.sessionStorage.getItem("sapper-has-refreshed")) {
        window.sessionStorage.setItem("sapper-has-refreshed", "1");
        window.location.reload();
      }
    }
  });
</script>

<ToTop />

<header role="banner">
  <div class="wrapper-header">
    <a sapper:prefetch class="logo" href="/">
      <img src="assets/img/mailcheck-logo.svg" alt="mail" />
    </a>
    <nav class="header-nav" role="navigation">
      <a sapper:prefetch class="nav-link" href="/#features">Features</a>
      <a sapper:prefetch class="nav-link" href="/#pricing">Pricing</a>
      <a sapper:prefetch class="nav-link" href="/#contact-us">Contact Us</a>
      <a sapper:prefetch class="nav-link" href="/blog">Blog</a>
      <a sapper:prefetch class="nav-link" href="/faq">FAQ</a>
    </nav>
    <div>
      <select class="select" on:blur="{onLangSelect}">
        <option value="en">en</option>
        <option value="es">es</option>
        <option value="ru">ru</option>
      </select>
      <a href="//app.mailcheck.co/" class="btn btn-sign-in"> sign in </a>
    </div>
  </div>
</header>

<!--Mobile menu-->
<button
  class="burger-wrapper"
  class:open
  on:click="{() => (open = !open)}"
  id="burger">
  <span class="burger"></span>
</button>
<nav
  class="mobile-menu"
  class:open
  on:click="{() => (open = !open)}"
  role="navigation"
  id="mobile-menu">
  <a sapper:prefetch class="nav-link mobile-menu-links" href="/#features"
    >Features</a>
  <a sapper:prefetch class="nav-link mobile-menu-links" href="/#pricing"
    >Pricing</a>
  <a sapper:prefetch class="nav-link mobile-menu-links" href="/#contact-us"
    >Contact Us</a>
  <a sapper:prefetch class="nav-link mobile-menu-links" href="/blog">Blog</a>
  <a sapper:prefetch class="nav-link mobile-menu-links" href="/faq">FAQ</a>
  <a href="//app.mailcheck.co/" class="btn btn-sign-in mobile-btn">sign in</a>
  <select class="select-mobile mobile-menu-links" on:blur="{onLangSelect}">
    <option value="en">en</option>
    <option value="es">es</option>
    <option value="ru">ru</option>
  </select>
</nav>
