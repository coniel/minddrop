import { TagGroupsStore } from '../TagGroupsStore';
import { TagGroupNotFoundError } from '../errors';
import { TagGroup } from '../types';

/**
 * Retrieves a tag group from the store by ID.
 *
 * @param id - The ID of the tag group.
 * @param throwOnNotFound - Whether to throw an error if the group is not found.
 * @returns The tag group object.
 *
 * @throws {TagGroupNotFoundError} If the tag group does not exist.
 */
export function getTagGroup(id: string): TagGroup;
export function getTagGroup(
  id: string,
  throwOnNotFound: false,
): TagGroup | null;
export function getTagGroup(
  id: string,
  throwOnNotFound = true,
): TagGroup | null {
  // Get the tag group from the store
  const group = TagGroupsStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!group && throwOnNotFound) {
    throw new TagGroupNotFoundError(id);
  } else if (!group && !throwOnNotFound) {
    return null;
  }

  return group;
}
