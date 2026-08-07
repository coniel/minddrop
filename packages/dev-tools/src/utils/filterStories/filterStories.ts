import { StoryGroup } from '../../storyRegistry';

/**
 * Filters story groups by search text, matched against the story
 * and group names.
 *
 * Groups whose own name matches keep all of their stories, so that
 * searching for a group lists everything in it.
 *
 * @param groups - The story groups to filter.
 * @param search - The text stories must contain, matched case
 *   insensitively.
 * @returns The groups with at least one matching story.
 */
export function filterStories(
  groups: StoryGroup[],
  search: string,
): StoryGroup[] {
  const query = search.trim().toLowerCase();

  // No search text means no filtering
  if (!query) {
    return groups;
  }

  return groups
    .map((group) => {
      if (group.group.toLowerCase().includes(query)) {
        return group;
      }

      return {
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(query),
        ),
      };
    })
    .filter((group) => group.items.length > 0);
}
