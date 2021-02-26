import {routes} from '@sapper/internal/manifest-client.mjs';

const render = (pages, categories, posts) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${pages.map(page => `<url><loc>https://www.mailcheck.co/${page}</loc></url>
        `).join('')}
        ${categories.map(cat => `<url><loc>https://www.mailcheck.co/blog/c/${cat}/</loc></url>
        `).join('')}
        ${posts.map(post => `<url><loc>https://www.mailcheck.co/${post}</loc></url>
        `).join('')}
</urlset>`;

export function get(req, res, next) {

    res.setHeader('Cache-Control', `max-age=0, s-max-age=${600}`); // 10 minutes
    res.setHeader('Content-Type', 'application/rss+xml');

    let data = []
    routes.forEach(el => {
        data.push( el.pattern.source.toString()
            .replace(/\\/g, '')
            .split('/')
            .filter(element => /[a-zA-Z-]/.exec(element))
            .join('/')
            // .replace(/\/\s*$/, "") //remove trailing "/"
        )
    })
    data = [...new Set(data)]

    const pages = data.filter(url=>url.search('/')===-1);
    const posts = data.filter(url=>url.search('/')>0);


    const feed = render(pages, [], posts);
    res.end(feed);
}
