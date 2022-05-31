<script lang="ts">
    import { page } from '$app/stores';
    import data from '$lib/utils/site-data';
    import { serializeSchema } from '$lib/utils/json-ld';
    import type { Schema } from '$lib/utils/json-ld';
  
    export let schemas: Schema[];
    export let canonical = '';
    export let title: string;
    export let thumbnail = '';
    export let desc = '';
    export let noindex = false;
  
    const { siteName, siteUrl } = data;
    const defaultDesc = data.description;
  </script>
  
  <svelte:head>
    <title>{siteName} | {title}</title>
    <!-- <base href={siteUrl}> !!! for production only !!! -->
    <link
      rel="canonical"
      href={canonical
        ? siteUrl + canonical
        : siteUrl + ($page.url.pathname ?? '')}
    />
  
    <!-- Meta -->
    <meta name="description" content={desc || defaultDesc} />
    <meta name="msapplication-TileColor" content={data.theme} />
    <meta name="theme-color" content={data.theme} />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="robots" content={noindex ? 'noindex' : 'index,follow'} />
    <meta name="googlebot" content={noindex ? 'noindex' : 'index,follow'} />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content={siteName} />
    <meta name="apple-mobile-web-app-status-bar-style" content="pink" />
    <meta name="referrer" content="always" />
    <meta name="generator" content="sveltekit" />
    <meta name="subject" content={title} />
    <meta name="rating" content="safe for kids" />
    <meta name="format-detection" content="telephone=no" />
  
    <!-- Facebook -->
    <meta property="fb:admins" content={data.fbAdmin} />
    <meta property="fb:app_id" content={data.fbAppID} />
    <meta property="op:markup_version" content="v1.0" />
  
    <!-- TODO:
      <link rel="dns-prefetch" href="//example.com/">
      <link rel="preconnect" href="https://www.example.com/" />
      <link rel="prefetch" href="https://www.example.com/" />
      <link rel="prerender" href="https://example.com/" /> -->
  
    <!-- Open Graph -->
    <meta property="og:type" content="business.business" />
    <meta property="og:url" content="{siteUrl}{$page.url.pathname}" />
    <meta property="og:title" content={title || siteName} />
    <meta property="og:description" content={desc || defaultDesc} />
    <meta property="og:image" content={thumbnail || siteUrl + '/favicon.png'} />
    <meta property="og:image:alt" content={desc || defaultDesc} />
    <meta property="business:contact_data:country_name" content="Ukraine" />
    <meta property="og:locale" content="uk_UA" />
    <meta property="og:site_name" content={siteName} />
  
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="{siteUrl}{$page.url.pathname}" />
    <meta property="twitter:title" content={title || siteName} />
    <meta property="twitter:description" content={desc || defaultDesc} />
    {#if thumbnail}
      <meta property="twitter:image" content={thumbnail} />
  
      <!-- Shop item -->
      <link rel="preload" href={thumbnail} as="image" />
    {/if}
  
    <!-- JSON-LD Schema -->
    {#each schemas as schema}
      {@html serializeSchema(schema)}
    {/each}
  </svelte:head>