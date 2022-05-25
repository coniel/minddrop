import { Core } from '@minddrop/core';
import { FieldValue, FieldValueArrayUnion } from '@minddrop/utils';
import { DropTypeData, Drop } from '../types';
import { DropsResource } from '../DropsResource';

/**
 * Adds tags to a drop.
 *
 * @param core A MindDrop core instance.
 * @param dropId The ID of the drop to which to add the tags.
 * @param tagIds The IDs of the tags to add to the drop.
 * @returns The updated drop.
 */
export function addTagsToDrop<TTypeData extends DropTypeData = {}>(
  core: Core,
  dropId: string,
  tagIds: string[],
): Drop<TTypeData> {
  // Update the drop, adding the tag IDs
  const drop = DropsResource.update<{ tags: FieldValueArrayUnion }, TTypeData>(
    core,
    dropId,
    {
      tags: FieldValue.arrayUnion(tagIds),
    },
  );

  // Return the updated drop
  return drop;
}
