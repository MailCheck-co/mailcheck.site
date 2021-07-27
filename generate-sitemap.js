import fs from 'fs';
import fg from 'fast-glob';
import { create } from 'xmlbuilder2';
import pkg from './package.json';

const getUrl = (url) => {
  const trimmed = url.slice(6).replace('index.html', '');
  return `${pkg.url}${trimmed}`;
};

async function createSitemap() {
  const sitemap = create({ version: '1.0' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  });

  const pages = await fg(['build/**/*.html']);

  pages.forEach((page) => {
    const noindex1 = page.match("terms");
    const noindex2 = page.match("privacy");
    const noindex3 = page.match("cookies");
    const noindex4 = page.match("404");
    if (!noindex1 && !noindex2 && !noindex3 && !noindex4) {
      const url = sitemap.ele('url');
      url.ele('loc').txt(getUrl(page));
      url.ele('changefreq').txt('weekly');
    }
  });

  const xml = sitemap.end({ prettyPrint: true });

  fs.writeFileSync('build/sitemap.xml', xml);
}

createSitemap();
