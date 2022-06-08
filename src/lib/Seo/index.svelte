<script lang="ts">
  import { page } from '$app/stores';
  import data from '$utils/site-data';
  import { serializeSchema } from '$utils/json-ld';
  import type { Schema } from '$utils/json-ld';
  import { browser } from '$app/env';

  export let schemas: Schema[];
  export let canonical = '';
  export let title: string;
  export let isPost = false;
  export let thumbnail = '';
  export let desc = '';
  export let noindex = false;

  const { siteName, siteUrl, fbAppId } = data;
  const defaultDesc = data.description;
  const defaultImage = thumbnail || siteUrl + '/favicon.png';
</script>

<svelte:head>
  <title>{siteName} | {title}</title>
  <link
    rel="canonical"
    href={canonical ? siteUrl + canonical : siteUrl + ($page.url.pathname ?? '')} />
  <meta name="description" content={desc || defaultDesc} />
  <meta name="msapplication-TileColor" content={data.theme} />
  <meta name="theme-color" content={data.theme} />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <meta name="robots" content={noindex ? 'noindex' : 'index,follow'} />
  <meta name="googlebot" content={noindex ? 'noindex' : 'index,follow'} />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-title" content={siteName} />
  <meta name="apple-mobile-web-app-status-bar-style" content={data.theme} />
  <meta name="referrer" content="always" />
  <meta name="generator" content="sveltekit" />
  <meta name="subject" content={title} />
  <meta name="rating" content="safe for kids" />
  <meta name="format-detection" content="telephone=no" />

  <!-- Open Graph / Facebook -->
  <meta property="op:markup_version" content="v1.0" />
  <meta property="fb:app_id" content="{fbAppId}" />
  <meta property="og:type" content={isPost ? 'blog' : 'website'} />
  <meta property="og:url" content="{siteUrl}{$page.url.pathname ?? ''}" />
  <meta property="og:title" content={title || siteName} />
  <meta property="og:description" content={desc || defaultDesc} />
  <meta property="og:image" content={defaultImage} />
  <meta property="og:image:alt" content={desc || defaultDesc} />
  <meta property="business:contact_data:country_name" content="Ukraine" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content={siteName} />

  <!-- Twitter -->
  <meta property="twitter:card" content={data.twitterCard} />
  <meta property="twitter:url" content="{siteUrl}{$page.url.pathname ?? ''}" />
  <meta property="twitter:title" content={title || siteName} />
  <meta property="twitter:description" content={desc || defaultDesc} />
  <meta property="twitter:image" content={defaultImage} />

  <link rel="preload" href={defaultImage} as="image" />

  {#if !browser}
    <!-- RSS Feed -->
    <link
      rel="alternate"
      type="application/rss+xml"
      title="RSS Feed for mailcheck.co"
      href="/rss.xml" />

    <!-- JSON-LD Schema -->
    {#each schemas as schema}
      {@html serializeSchema(schema)}
    {/each}{/if}
</svelte:head>
