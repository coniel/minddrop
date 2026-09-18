import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { CollectionEntityType, CollectionGroupsType } from './constants';
import { CollectionDeletedEvent } from './events';

/**
 * The collection groups entity group type. A collection belongs to
 * one group at most.
 */
export const CollectionGroupsTypeConfig: EntityGroupTypeConfig = {
  id: CollectionGroupsType,
  itemTypes: [CollectionEntityType],
  ungrouped: true,
  itemDeletedEvents: [CollectionDeletedEvent],
};
