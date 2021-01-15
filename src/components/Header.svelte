<script>
    import { onMount } from "svelte";
    
    let open = false;
    let show = false;
    let url = '';
    let lang = 'en';

    const onLangSelect = (e) => {
        const current = e.target.options.selectedIndex;
        switch (+current) {
            case 0: lang = 'en';
                break;
            case 1: lang = 'es';
                break;
            case 2: lang = 'ru';
                break;
            default: lang = 'en';
                break;
        }
    };

    onMount(() => {
        const windowHeight = window.innerHeight;
        url = `${window.location.pathname}/#top`;
        window.addEventListener("scroll", function () {
            if (window.pageYOffset > windowHeight) {
                show = true;
            } else {
                show = false;
            }
        });
    });
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
        <div>
            <select class="select" on:change={onLangSelect}>
                <option value="en">en</option>
                <option value="es">es</option>
                <option value="ru">ru</option>
            </select>
            <a href="//app.mailcheck.co/" class="btn btn-sign-in">
                sign in
            </a>
        </div>
        
    </div>
</header>

<a href={url} class="btn-top" class:show>
    <img src="assets/img/arrow-slide-nav.svg" alt="to top" />
</a>

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
</nav>
