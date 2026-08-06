import { type CollectionEntry, getCollection } from 'astro:content';

/**
 * Returns published blog posts, newest first.
 *
 * Unpublished posts are filtered out here rather than per page, so drafts
 * cannot reach the index, the feed, or the generated routes.
 */
export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => data.published);

  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
