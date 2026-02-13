/**
 * @type {import('@sveltejs/kit').PageLoad}
 */
export async function load({ fetch }) {
  const videos = await fetch('/videos.json').then((res: Response) => res.json());
  return {
    videos
  };
}
