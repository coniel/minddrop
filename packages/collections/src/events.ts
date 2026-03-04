import { Collection } from './types';

export const CollectionCreatedEvent = 'collections:collection:created';
export const CollectionUpdatedEvent = 'collections:collection:updated';
export const CollectionDeletedEvent = 'collections:collection:deleted';
export const CollectionsLoadedEvent = 'collections:loaded';

export type CollectionCreatedEventData = Collection;

export type CollectionUpdatedEventData = {
  original: Collection;
  updated: Collection;
};

export type CollectionDeletedEventData = Collection;

export type CollectionsLoadedEventData = Collection[];
