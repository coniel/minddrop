import { EntityGroup } from './types';

export const EntityGroupCreatedEvent = 'entity-groups:group:created';
export const EntityGroupUpdatedEvent = 'entity-groups:group:updated';
export const EntityGroupDeletedEvent = 'entity-groups:group:deleted';
export const EntityGroupsReorderedEvent = 'entity-groups:groups:reordered';
export const EntityGroupsLoadedEvent = 'entity-groups:loaded';

export type EntityGroupCreatedEventData = EntityGroup;

export type EntityGroupUpdatedEventData = {
  original: EntityGroup;
  updated: EntityGroup;
};

export type EntityGroupDeletedEventData = EntityGroup;

export type EntityGroupsReorderedEventData = {
  type: string;
  groups: EntityGroup[];
};

export type EntityGroupsLoadedEventData = EntityGroup[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'entity-groups:group:created': EntityGroupCreatedEventData;
    'entity-groups:group:updated': EntityGroupUpdatedEventData;
    'entity-groups:group:deleted': EntityGroupDeletedEventData;
    'entity-groups:groups:reordered': EntityGroupsReorderedEventData;
    'entity-groups:loaded': EntityGroupsLoadedEventData;
  }
}
