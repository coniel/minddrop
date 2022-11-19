import { Core } from '@minddrop/core';
import { FieldValue } from '@minddrop/utils';
import { Drop, DropTypeData } from '../types';
import { DropsResource } from '../DropsResource';

/**
 * Removes tags from a drop.
 *
 * @param core - A MindDrop core instance.
 * @param dropId - The ID of the drop from which to remove the tags.
 * @param tagIds - The IDs of the tags to remove.
 * @returns The updated drop.
 */
export function removeTagsFromDrop<TTypeData extends DropTypeData = {}>(
  core: Core,
  dropId: string,
  tagIds: string[],
): Drop<TTypeData> {
  // Remove the specified tags from the drop.
  const drop = DropsResource.update<{}, TTypeData>(core, dropId, {
    tags: FieldValue.arrayRemove(tagIds),
  });

  return drop;
}
