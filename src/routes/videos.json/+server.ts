import { json } from '@sveltejs/kit';

import fetchData from '../videos/_videos';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

interface VideoItem {
  snippet: {
    publishedAt: string;
    resourceId: { videoId: string };
    title: string;
    description: string;
  };
}

export const GET: RequestHandler = async () => {
  const response = await fetchData();
  let videos = [];
  try {
    videos = response.items.map((video: VideoItem) => {
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

  return json(videos);
};
