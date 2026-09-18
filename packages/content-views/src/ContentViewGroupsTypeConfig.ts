import { EntityGroupTypeConfig } from '@minddrop/entity-groups';
import { ContentViewEntityType, ContentViewGroupsType } from './constants';
import { ContentViewDeletedEvent } from './events';

/**
 * The content view groups entity group type. A content view belongs
 * to one group at most.
 */
export const ContentViewGroupsTypeConfig: EntityGroupTypeConfig = {
  id: ContentViewGroupsType,
  itemTypes: [ContentViewEntityType],
  ungrouped: true,
  itemDeletedEvents: [ContentViewDeletedEvent],
};
