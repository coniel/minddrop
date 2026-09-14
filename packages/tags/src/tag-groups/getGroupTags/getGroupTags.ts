import { EntityGroups } from '@minddrop/entity-groups';
import { TagGroupsType } from '../../constants';
import { getTag } from '../../getTag';
import { Tag } from '../../types';

/**
 * Retrieves a tag group's tags, in the group's order. A tag the
 * group lists but which no longer exists is left out.
 *
 * @param groupId - The ID of the tag group.
 * @returns The group's tags.
 *
 * @throws {EntityGroupNotFoundError} If the group does not exist.
 */
export function getGroupTags(groupId: string): Tag[] {
  return EntityGroups.get(TagGroupsType, groupId)
    .items.map((tagId) => getTag(tagId, false))
    .filter((tag): tag is Tag => tag !== null);
}
