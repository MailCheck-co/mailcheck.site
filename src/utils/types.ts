export type IPost = {
  slug: string;
  title: string;
  snippet: string;
  date: Date | string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  noindex?: boolean | string;
  thumbnail: string;
  description?: string;
};
