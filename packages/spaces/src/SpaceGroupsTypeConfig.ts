import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { SpaceEntityType, SpaceGroupsType } from './constants';
import { SpaceDeletedEvent } from './events';

/**
 * The space groups entity group type. A space belongs to one group
 * at most.
 */
export const SpaceGroupsTypeConfig: EntityGroupTypeConfig = {
  id: SpaceGroupsType,
  itemTypes: [SpaceEntityType],
  ungrouped: true,
  itemDeletedEvents: [SpaceDeletedEvent],
};
