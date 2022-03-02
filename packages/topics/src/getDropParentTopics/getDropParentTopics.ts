import { Drops } from '@minddrop/drops';
import { getTopics } from '../getTopics';
import { TopicFilters, TopicMap } from '../types';

/**
 * Returns an `{ [id]: Topic }` map of a given drop's parent topics. The results
 * can be filtered using TopicFilters.
 *
 * @param dropId The ID of the drop for which to retrieve the parent topics.
 * @param filters Filters to filter the parent topics by.
 * @returns A `{ [id]: Topic }` map of the drop's parent topics.
 */
export function getDropParentTopics(
  dropId: string,
  filters?: TopicFilters,
): TopicMap {
  // Get the drop
  const drop = Drops.get(dropId);

  // Get the drop's parent topic IDs
  const parentTopicIds = drop.parents
    .filter((parent) => parent.type === 'topic')
    .map((parent) => parent.id);

  // Get the parent topics with possible filters applied
  const parents = getTopics(parentTopicIds, filters);

  return parents;
}
