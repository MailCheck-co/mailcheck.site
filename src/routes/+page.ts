/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ fetch }) {
  const list = await fetch('/videos.json').then((res: Response) => res.json());
  const videos = list && list.length >= 2 ? [list[0], list[1]] : list || [];
  return {
    videos
  };
}
