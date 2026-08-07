import { Story, StoryGroup } from '../../storyRegistry';

/**
 * Groups stories by the group they were registered under, sorting
 * the groups and the stories within them by name.
 *
 * @param stories - The stories to group.
 * @returns A group per story group name.
 */
export function groupStories(stories: Story[]): StoryGroup[] {
  const groups = new Map<string, StoryGroup>();

  for (const { group, label, component } of stories) {
    const existing = groups.get(group);

    if (existing) {
      existing.items.push({ label, component });
    } else {
      groups.set(group, { group, items: [{ label, component }] });
    }
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      items: [...group.items].sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.group.localeCompare(b.group));
}
