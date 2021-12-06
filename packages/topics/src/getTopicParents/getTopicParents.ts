import { filterTopics } from '../filterTopics';
import { getAllTopics } from '../getAllTopics';
import { TopicFilters, TopicMap } from '../types';

/**
 * Returns an `[id]: Topic` map of a given topic's parents. The results
 * can be filtered using TopicFilters.
 *
 * @param topicId The ID of the topic for which to retrieve the parents.
 * @param filters Filters to filter the prants by.
 * @returns A `[id]: Topic` map of the topic's parents.
 */
export function getTopicParents(
  topicId: string,
  filters?: TopicFilters,
): TopicMap {
  const allTopics = getAllTopics();
  const parents = Object.values(allTopics)
    .filter((topic) => topic.subtopics.includes(topicId))
    .reduce((map, topic) => ({ ...map, [topic.id]: topic }), {});

  if (filters) {
    return filterTopics(parents, filters);
  }

  return parents;
}
