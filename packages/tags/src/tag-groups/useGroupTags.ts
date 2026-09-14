import { useMemo } from 'react';
import { EntityGroups } from '@minddrop/entity-groups';
import { TagsStore } from '../TagsStore';
import { TagGroupsType } from '../constants';
import { Tag } from '../types';

/**
 * Retrieves a tag group's tags, in the group's order. Empty when
 * the group does not exist.
 *
 * @param groupId - The ID of the tag group.
 * @returns The group's tags.
 */
export function useGroupTags(groupId: string): Tag[] {
  const group = EntityGroups.use(TagGroupsType, groupId);
  const tags = TagsStore.useAllItemsArray();

  return useMemo(
    () =>
      (group?.items ?? [])
        .map((tagId) => tags.find((tag) => tag.id === tagId))
        .filter((tag): tag is Tag => tag !== undefined),
    [group, tags],
  );
}
