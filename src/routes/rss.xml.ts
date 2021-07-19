import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ host }) => {
  const maxAge = 600;
  const body = `
<?xml version="1.0" encoding="utf-8" ?>
<rss version="2.0" xml:base="https://www.mailcheck.com">
</rss>
`;
  const headers = {
    'Cache-Control': `max-age=0, s-max-age=${maxAge}`,
    'Content-Type': 'application/xml'
  };
  return {
    headers,
    body
  };
};
