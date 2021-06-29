import type { Thing, WithContext, Organization, WebSite } from "schema-dts";
import site from './site.json';

export type Schema = Thing | WithContext<Thing>;

export function serializeSchema(thing: Schema) {
  return `<script type="application/ld+json">${JSON.stringify(
    thing,
    null,
    2
  )}</script>`;
}

export const websiteSchema: WithContext<WebSite> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.title,
  url: site.url,
  description: site.description,
  sameAs: [
    `https://twitter.com/${site.social.twitter}`
  ],
};

export const blogSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}#organization`,
  url: site.url,
  name: site.company.name,
  description: site.description,
  sameAs: [`https://twitter.com/${site.social.twitter}`],
  logo: `${site.url}/favicon.svg`,
};
