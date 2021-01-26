<svelte:head>
  <title>{title} | {siteName}</title>
  <link rel="canonical" href={siteUrl}{$page.path} />
  <meta name="description" content={desc} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={isPost ? 'blog' : 'website'} />
  <meta property="og:url" content="{siteUrl}{$page.path}" />
  <meta property="og:title" content={title || siteName} />
  <meta property="og:description" content={desc} />
  <meta
    property="og:image"
    content={thumbnail}
  />

  <!-- Twitter -->
  <meta
    property="twitter:card"
    content="summary_large_image"
  />
  <meta property="twitter:url" content="{siteUrl}{$page.path}" />
  <meta property="twitter:title" content={title || siteName} />
  <meta property="twitter:description" content={desc} />
  <meta property="twitter:image" content={thumbnail} />
</svelte:head>

<script>
    import { stores } from "@sapper/app"

    const { page } = stores()
    export let siteName = 'Mailcheck'
    export let siteUrl = 'https://www.mailcheck.co'
    export let title
    export let isPost = true
    export let thumbnail
    export let desc
</script>
