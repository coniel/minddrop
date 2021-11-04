export type Frontmatter = {
  metaTitle: string;
  metaDescription?: string;
  publishedAt?: string;
  metaImage?: string;
  features?: string[];
  name?: string;
  slug: string;
  by?: 'oscar';
  readingTime?: { text: string; minutes: number; time: number; words: number };
  package?: string;
};
