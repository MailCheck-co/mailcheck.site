import type { Thing, WithContext, Organization, WebSite, Blog, Article } from 'schema-dts';
import data from './site-data';

export type Schema = Thing | WithContext<Thing>;

export function serializeSchema(thing: Schema): string {
  return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}

export const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: data.siteName,
  url: data.siteUrl,
  description: data.description,
  author: data.author,
  sameAs: [data.siteUrl, data.twitter, data.facebook, data.linkedin, data.github]
};

export const blogSchema: WithContext<Blog> = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  url: `${data.siteUrl}/blog`,
  name: `Blog | ${data.siteName}`,
  description: data.description
};

export const articleSchema: WithContext<Article> = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  url: data.siteUrl,
  name: data.siteName,
  description: data.description,
  // TODO: article categories
  articleSection: 'Emails, Antispam, Marketing, Subscriptions, Mailings',
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['#title', '.content-block']
  },
  author: {
    '@type': 'Organization',
    url: data.siteUrl,
    name: data.author,
    legalName: data.siteName,
    alternateName: data.siteName,
    description: data.description,
    contactPoint: {
      '@type': 'ContactPoint',
      email: data.email,
      contactType: 'customer service'
    },
    sameAs: [data.siteUrl, data.twitter, data.facebook, data.linkedin, data.github],
    logo: {
      '@type': 'ImageObject',
      name: 'Mailcheck Logo',
      url: `${data.siteUrl}/favicon.png`,
      width: '64',
      height: '64'
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London, England',
      postalCode: 'WC2E 9HA',
      streetAddress: 'Suite 4005 43 Bedford Street'
    }
  }
};

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': data.siteUrl,
  url: data.siteUrl,
  name: data.siteName,
  legalName: data.siteName,
  alternateName: data.siteName,
  description: data.description,
  contactPoint: {
    '@type': 'ContactPoint',
    email: data.email,
    contactType: 'customer service'
  },
  sameAs: [data.siteUrl, data.twitter, data.facebook, data.linkedin, data.github],
  logo: {
    '@type': 'ImageObject',
    name: 'Mailcheck Logo',
    url: `${data.siteUrl}/favicon.png`,
    width: '64',
    height: '64'
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'London, England',
    postalCode: 'WC2E 9HA',
    streetAddress: 'Suite 4005 43 Bedford Street'
  }
};
