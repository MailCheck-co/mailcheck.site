import posts from "./_posts.js";

const contents = JSON.stringify(
  posts.map((post) => {
    return {
      title: post.data.title,
      slug: post.data.slug,
      date: post.data.date,
      readingTime: post.data.readingTime,
      snippet: post.data.snippet,
    };
  })
);

export function get(req, res) {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(contents);
}
