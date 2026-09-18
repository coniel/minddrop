import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { QueryEntityType, QueryGroupsType } from './constants';
import { QueryDeletedEvent } from './events';

/**
 * The query groups entity group type. A query belongs to one group
 * at most.
 */
export const QueryGroupsTypeConfig: EntityGroupTypeConfig = {
  id: QueryGroupsType,
  itemTypes: [QueryEntityType],
  ungrouped: true,
  itemDeletedEvents: [QueryDeletedEvent],
};
