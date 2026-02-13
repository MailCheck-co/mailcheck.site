export type EnhancedImg = {
  src: string;
  w: number;
  h: number;
};

export type IPost = {
  slug: string;
  title: string;
  snippet: string;
  description?: string;
  date: string;
  thumbnail?: string | EnhancedImg;
  thumbnailImg?: string | EnhancedImg;
  published: boolean;
  readingTime?: string;
};
