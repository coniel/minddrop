import { type CollectionEntry, getCollection } from 'astro:content';

/**
 * Returns changelog entries, newest build first.
 */
export async function getChangelogEntries(): Promise<
  CollectionEntry<'changelog'>[]
> {
  const entries = await getCollection('changelog');

  return entries.sort((a, b) => b.data.build - a.data.build);
}
