import fetchData from './_videos';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
  const response = await fetchData();
  const videos = response.items.map((video: any) => {
      return {
          id: video.snippet.resourceId.videoId,
          title: video.snippet.title,
          desc: video.snippet.description
      };
  });

  return {
    body: videos
  };
};