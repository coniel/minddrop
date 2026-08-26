import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionCreatedEvent } from '../events';
import { Collection } from '../types';

/**
 * Creates a virtual collection that exists only in memory.
 * Virtual collections are not persisted to the file system.
 *
 * @param id - The unique identifier for the collection.
 * @param name - The name of the collection.
 * @param items - The initial item IDs in the collection.
 *
 * @returns The created virtual collection.
 *
 * @dispatches collections:collection:created
 */
export function createVirtualCollection(
  id: string,
  name: string,
  items: string[] = [],
): Collection {
  // Generate the virtual collection object
  const collection: Collection = {
    id,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
    name,
    items,
  };

  // Add the collection to the store
  CollectionsStore.set(collection);

  // Dispatch the collection created event
  Events.dispatch(CollectionCreatedEvent, collection);

  return collection;
}
