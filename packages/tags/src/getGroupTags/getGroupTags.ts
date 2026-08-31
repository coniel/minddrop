import { TagsStore } from '../TagsStore';
import { Tag } from '../types';

/**
 * Retrieves the tags belonging to a tag group.
 *
 * @param groupId - The ID of the tag group.
 * @returns The group's tags.
 */
export function getGroupTags(groupId: string): Tag[] {
  // Filter the tags down to the group's members
  return TagsStore.getAllArray().filter((tag) => tag.group === groupId);
}
