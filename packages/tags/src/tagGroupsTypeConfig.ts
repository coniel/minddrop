import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { TagEntityType, TagGroupsType } from './constants';
import { TagDeletedEvent } from './events';

/**
 * The tag groups entity group type. A tag belongs to one group at
 * most, and the tags in none form the ungrouped group.
 */
export const tagGroupsTypeConfig: EntityGroupTypeConfig = {
  id: TagGroupsType,
  itemTypes: [TagEntityType],
  ungrouped: true,
  itemDeletedEvents: [TagDeletedEvent],
};
