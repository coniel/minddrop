import { filterTopics } from '../filterTopics';
import { getAllTopics } from '../getAllTopics';
import { TopicFilters, TopicMap } from '../types';

/**
 * Returns an `{ [id]: Topic }` map of a given drop's parent topics. The results
 * can be filtered using TopicFilters.
 *
 * @param dropId The ID of the drop for which to retrieve the parent topics.
 * @param filters Filters to filter the parent topics by.
 * @returns A `{ [id]: Topic }` map of the drop's parent topics.
 */
export function getDropParents(
  dropId: string,
  filters?: TopicFilters,
): TopicMap {
  const allTopics = getAllTopics();
  const parents = Object.values(allTopics)
    .filter((topic) => topic.drops.includes(dropId))
    .reduce((map, topic) => ({ ...map, [topic.id]: topic }), {});

  if (filters) {
    return filterTopics(parents, filters);
  }

  return parents;
}
