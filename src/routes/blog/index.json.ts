import posts from './_posts.js';
import { RequestHandler } from '@sveltejs/kit';
import { Locals } from '$lib/types';

const contents = JSON.stringify(
  posts.map((post) => {
    console.log(post);
    return {
      title: post.data.title,
      slug: post.data.slug,
      date: post.data.date,
      readingTime: post.data.readingTime,
      snippet: post.data.snippet,
      desc: post.data.desc
    };
  })
);

export const get: RequestHandler<Locals> = async (request) => {
  console.log('get', posts);

  return { status: 200, body: contents };
};
