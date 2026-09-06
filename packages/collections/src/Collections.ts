import { CollectionsIcon, DefaultCollectionIcon } from './constants';
import { CollectionNotFoundError } from './errors';
import {
  CollectionCreatedEvent,
  CollectionDeletedEvent,
  CollectionUpdatedEvent,
  CollectionsLoadedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: CollectionCreatedEvent,
  Updated: CollectionUpdatedEvent,
  Deleted: CollectionDeletedEvent,
  Loaded: CollectionsLoadedEvent,
} as const;

export const errors = {
  NotFound: CollectionNotFoundError,
};

export const constants = {
  Icon: CollectionsIcon,
  EntityDefaultIcon: DefaultCollectionIcon,
};

export { createCollection as create } from './createCollection';
export { createVirtualCollection as createVirtual } from './createVirtualCollection';
export { loadVirtualCollections as loadVirtual } from './loadVirtualCollections';
export { deleteCollection as delete } from './deleteCollection';
export { getCollection as get } from './getCollection';
export { getAllCollections as getAll } from './getAllCollections';
export { writeCollection as write } from './writeCollection';
export { readCollection as read } from './readCollection';
export {
  CollectionsStore as Store,
  useCollection as use,
  useCollections as useAll,
} from './CollectionsStore';
export { updateCollection as update } from './updateCollection';
export { addCollectionItems as addItems } from './addCollectionItems';
export { searchCollections as search } from './utils';
export { removeCollectionItems as removeItems } from './removeCollectionItems';
export { initializeCollections as initialize } from './initializeCollections';
