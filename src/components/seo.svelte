<svelte:head>
    <title>{siteName} | {title}</title>
    <link rel="canonical" href={canonical? siteUrl + canonical : siteUrl+$page.path}/>
    <meta name="description" content={desc}/>

    {#if noindex}
        <meta name="robots" content="noindex">
    {/if}

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={isPost ? 'blog' : 'website'}/>
    <meta property="og:url" content="{siteUrl}{$page.path}"/>
    <meta property="og:title" content={title || siteName}/>
    <meta property="og:description" content={desc}/>
    <meta
        property="og:image"
        content={thumbnail || siteUrl+'/favicon.png'}
    />

    <!-- Twitter -->
    <meta
        property="twitter:card"
        content="summary_large_image"
    />
    <meta property="twitter:url" content="{siteUrl}{$page.path}"/>
    <meta property="twitter:title" content={title || siteName}/>
    <meta property="twitter:description" content={desc}/>
    {#if thumbnail}
        <meta property="twitter:image" content={thumbnail}/>
    {/if}
</svelte:head>

<script>
    import {stores} from "@sapper/app"
    import data from "../site-data"

    const {siteName, siteUrl} = data

    const {page} = stores()

    export let canonical = ""
    export let title
    export let isPost = false
    export let thumbnail = false
    export let desc = data.desc
    export let noindex = false
</script>
