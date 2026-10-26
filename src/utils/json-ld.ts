import type {
  Thing,
  WithContext,
  Organization,
  WebSite,
  Blog,
  Article,
  BlogPosting,
  WebPage,
  FAQPage,
  BreadcrumbList,
  VideoObject
} from 'schema-dts';
import data from './site-data';

export type Schema = Thing | WithContext<Thing>;

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function serializeSchema(thing: Schema): string {
  return `<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;
}

export function toIsoDate(value?: string): string | undefined {
  const date = value?.trim();
  if (!date) return undefined;
  const legacy = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (legacy) return `${legacy[3]}-${legacy[2]}-${legacy[1]}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(date)) return date.slice(0, 10);
  const timestamp = Date.parse(date);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString().slice(0, 10);
}

export function toIsoDateTime(value?: string): string | undefined {
  const date = value?.trim();
  if (!date) return undefined;
  const isValidCalendarDate = (year: number, month: number, day: number) => {
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1];
  };
  const isLeapYear = (year: number) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const legacy = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (legacy) {
    const [, day, month, year] = legacy;
    if (!isValidCalendarDate(Number(year), Number(month), Number(day))) return undefined;
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }
  const isoDate = date.match(/^(\d{4})-(\d{2})-(\d{2})(?=$|T|\s)/);
  if (isoDate && !isValidCalendarDate(Number(isoDate[1]), Number(isoDate[2]), Number(isoDate[3]))) {
    return undefined;
  }
  const calendarDate = date.match(/^(?:\d{1,2} [A-Za-z]+ \d{4}|[A-Za-z]+ \d{1,2}, \d{4})$/);
  const namedDate = date.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$|^([A-Za-z]+) (\d{1,2}), (\d{4})$/);
  if (namedDate) {
    const day = Number(namedDate[1] ?? namedDate[5]);
    const monthName = namedDate[2] ?? namedDate[4];
    const year = Number(namedDate[3] ?? namedDate[6]);
    const month =
      [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
      ].indexOf(monthName.toLowerCase()) + 1;
    if (!isValidCalendarDate(year, month, day)) return undefined;
  }
  const timezoneFreeIso =
    /^\d{4}-\d{2}-\d{2}T/.test(date) && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(date);
  const timestamp = Date.parse(
    calendarDate || timezoneFreeIso ? `${date}${calendarDate ? ' 00:00:00 UTC' : 'Z'}` : date
  );
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString();
}

const publisher = {
  '@type': 'Organization' as const,
  '@id': `${data.siteUrl}#organization`,
  name: data.siteName,
  url: data.siteUrl,
  logo: `${data.siteUrl}/favicon.png`
};

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

export function webPageSchema({
  url,
  name,
  description,
  image,
  datePublished,
  dateModified
}: {
  url: string;
  name: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}): WithContext<WebPage> {
  const published = toIsoDate(datePublished);
  const modified = toIsoDate(dateModified) ?? published;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    description,
    ...(image ? { image } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {})
  };
}

export function breadcrumbListSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      item: new URL(item.url, data.siteUrl).href
    }))
  };
}

export function videoObjectSchema({
  id,
  title,
  description,
  date,
  pageUrl
}: {
  id: string;
  title: string;
  description: string;
  date?: string;
  pageUrl: string;
}): WithContext<VideoObject> {
  const isoDate = toIsoDateTime(date);
  const embedUrl = `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `${embedUrl}#video`,
    name: title,
    description,
    thumbnailUrl: `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`,
    embedUrl,
    url: pageUrl,
    ...(isoDate ? { uploadDate: isoDate } : {}),
    publisher
  };
}

export function blogPostingSchema({
  url,
  title,
  description,
  image,
  date,
  dateModified
}: {
  url: string;
  title: string;
  description: string;
  image?: string;
  date?: string;
  dateModified?: string;
}): WithContext<BlogPosting> {
  const published = toIsoDate(date);
  const modified = toIsoDate(dateModified) ?? published;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url,
    url,
    name: title,
    headline: title,
    description,
    ...(image ? { image } : {}),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    articleSection: 'Emails, Antispam, Marketing, Subscriptions, Mailings',
    author: publisher,
    publisher,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };
}

export function faqPageSchema(
  url: string,
  questions: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url,
    url,
    mainEntity: questions.map(({ question, answer }) => ({
      '@type': 'Question' as const,
      name: question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: answer
      }
    }))
  };
}

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${data.siteUrl}#organization`,
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
  sameAs: [data.twitter, data.facebook, data.linkedin, data.github],
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
