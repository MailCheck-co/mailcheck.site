import fetchData from './_videos';
// Snapshot of the public production feed; never fetch our own endpoint after cutover.
import fallbackVideos from './fallback.json';
export const GET = async () => {
  const headers = { 'content-type': 'application/json' };
  if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
    return new Response(JSON.stringify(fallbackVideos), { headers });
  }
  const response = (await fetchData()) as { items?: any[] };
  let videos: typeof fallbackVideos = [];
  try {
    videos = (response.items ?? []).map((video: any) => {
      const date = new Date(video.snippet.publishedAt);
      const month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];
      const publishedAt = `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`;
      return {
        id: video.snippet.resourceId.videoId,
        title: video.snippet.title,
        desc: video.snippet.description,
        date: publishedAt
      };
    });
  } catch {
    console.error('Youtube api error: ', response);
  }

  return new Response(JSON.stringify(videos?.length ? videos : fallbackVideos), { headers });
};
