import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { TagEntityType, TagGroupsType } from './constants';
import { TagDeletedEvent } from './events';

/**
 * The tag groups entity group type. A tag belongs to one group at
 * most.
 */
export const TagGroupsTypeConfig: EntityGroupTypeConfig = {
  id: TagGroupsType,
  itemTypes: [TagEntityType],
  ungrouped: true,
  itemDeletedEvents: [TagDeletedEvent],
};
