import { TopicMap, TopicFilters } from '../types';

/**
 * Filters topics by active and deleted state.
 * If no filters are set, returns active topics.
 * If deleted filters is `true`, active topics are
 * not included unless specifically set to `true`.
 *
 * @param topics The topics to filter.
 * @param filters The filters by which to filter the topics.
 * @returns The filtered topics.
 */
export function filterTopics(
  topics: TopicMap,
  filters: TopicFilters,
): TopicMap {
  // Active topics are included if `active = true` or no filters are set.
  const includeActive =
    filters.active === true || Object.keys(filters).length === 0;

  return Object.values(topics)
    .filter((topic) => {
      if (includeActive && !topic.deleted) {
        return true;
      }

      if (filters.deleted && topic.deleted) {
        return true;
      }

      return false;
    })
    .reduce((map, topic) => ({ ...map, [topic.id]: topic }), {});
}
