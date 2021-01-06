<script>
    let open = false;
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/header";
    @import "../scss/molecules/mobile-menu";
</style>

<header role="banner">
    <div class="wrapper-header">
        <a class="logo" href="/"><img
                src="assets/img/mailcheck-logo.svg"
                alt="mail" /></a>
        <nav class="header-nav" role="navigation">
            <a class="nav-link" href="/#features">Features</a>
            <a class="nav-link" href="/#pricing">Pricing</a>
            <a class="nav-link" href="/#contact-us">Contact Us</a>
            <a class="nav-link" href="/blog">Blog</a>
            <a class="nav-link" href="/faq">FAQ</a>
        </nav>
        <a href="//app.mailcheck.co/" class="btn btn-sign-in">sign in</a>
    </div>
</header>

<a href="#top" class="btn-top">
    <img src="assets/img/arrow-slide-nav.svg" alt="" />
</a>

<!--Mobile menu-->
<button class="burger-wrapper"
        class:open="{open}"
        on:click="{() => open = !open}"
        id="burger">
    <span class="burger" />
</button>
<nav class="mobile-menu"
     class:open="{open}"
     on:click="{() => open = !open}"
     role="navigation"
     id="mobile-menu">
    <a class="nav-link mobile-menu-links" href="/#features">Features</a>
    <a class="nav-link mobile-menu-links" href="/#pricing">Pricing</a>
    <a class="nav-link mobile-menu-links" href="/#contact-us">Contact Us</a>
    <a class="nav-link mobile-menu-links" href="/blog">Blog</a>
    <a class="nav-link mobile-menu-links" href="/faq">FAQ</a>
    <a href="//app.mailcheck.co/" class="btn btn-sign-in mobile-btn">sign in</a>
</nav>
