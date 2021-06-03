// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.

// const posts = __ROUTES__;

import * as matter from 'gray-matter';
import { extname, join } from 'path';
import { readdirSync } from 'fs';

function get_routes() {
  const blog_path = join(process.cwd(), 'src', 'routes', 'blog');
  console.log('blog_path', blog_path);
  return readdirSync(blog_path)
    .filter((p) => extname(p) === '.md')
    .map((post) => {
      console.log('post', post);
      return matter.read(join(blog_path, post));
    });
}

const posts = get_routes();
// posts.forEach(post => {
// 	post.html = post.html.replace(/^\t{3}/gm, '');
// });

export default posts;
