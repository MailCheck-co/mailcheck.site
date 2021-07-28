import fs from 'fs';
import fg from 'fast-glob';
import { create } from 'xmlbuilder2';
import pkg from './package.json';

const getUrl = (url) => {
  const trimmed = url.slice(6).replace('index.html', '');
  return `${pkg.url}${trimmed}`;
};

const filterRegexp = new RegExp('noindex');

async function createSitemap() {
  const sitemap = create({ version: '1.0' }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
  });

  const pages = await fg(['build/**/*.html']);
  
  const filteredPages = pages.map(path => {
    return [path, fs.readFileSync(path).toString()];
  }).filter(([path, content]) => {
    return !filterRegexp.test(content);
  }).map(([path]) => { return path });

  filteredPages.forEach((page) => {
      const url = sitemap.ele('url');
      url.ele('loc').txt(getUrl(page));
      url.ele('changefreq').txt('weekly');
  });

  const xml = sitemap.end({ prettyPrint: true });

  fs.writeFileSync('build/sitemap.xml', xml);
}

createSitemap();
