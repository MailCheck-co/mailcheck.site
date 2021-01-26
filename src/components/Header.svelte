<script>
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
</script>

<style lang="scss">
    @import "../scss/utilities/index";
    @import "../scss/molecules/header";
    @import "../scss/molecules/mobile-menu";
</style>

<ToTop />

<header role="banner">
    <div class="wrapper-header">
        <a class="logo" href="/">
            <img src="assets/img/mailcheck-logo.svg" alt="mail" />
        </a>
        <nav class="header-nav" role="navigation">
            <a class="nav-link" href="/#features">Features</a>
            <a class="nav-link" href="/#pricing">Pricing</a>
            <a class="nav-link" href="/#contact-us">Contact Us</a>
            <a class="nav-link" href="/blog">Blog</a>
            <a class="nav-link" href="/faq">FAQ</a>
        </nav>
        <div>
            <select class="select" on:blur={onLangSelect}>
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
    on:click={() => (open = !open)}
    id="burger">
    <span class="burger" />
</button>
<nav
    class="mobile-menu"
    class:open
    on:click={() => (open = !open)}
    role="navigation"
    id="mobile-menu">
    <a class="nav-link mobile-menu-links" href="/#features">Features</a>
    <a class="nav-link mobile-menu-links" href="/#pricing">Pricing</a>
    <a class="nav-link mobile-menu-links" href="/#contact-us">Contact Us</a>
    <a class="nav-link mobile-menu-links" href="/blog">Blog</a>
    <a class="nav-link mobile-menu-links" href="/faq">FAQ</a>
    <a href="//app.mailcheck.co/" class="btn btn-sign-in mobile-btn">sign in</a>
    <select class="select-mobile mobile-menu-links" on:blur={onLangSelect}>
        <option value="en">en</option>
        <option value="es">es</option>
        <option value="ru">ru</option>
    </select>
</nav>
