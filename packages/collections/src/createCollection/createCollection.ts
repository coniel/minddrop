import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { uuid } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionCreatedEvent, CollectionCreatedEventData } from '../events';
import { Collection } from '../types';
import { writeCollection } from '../writeCollection';

/**
 * Creates a new collection, adding it to the store and writing it to the
 * file system.
 *
 * @param name - The name of the collection, defaults to the collection type name.
 *
 * @returns The created collection.
 *
 * @dispatches collections:collection:created
 */
export async function createCollection(name?: string): Promise<Collection> {
  // Generate the collection object
  const collection: Collection = {
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
    name: name || i18n.t('collections.labels.collection'),
    entries: [],
  };

  // Add the collection to the store
  CollectionsStore.set(collection);

  // Write the collection config to the file system
  await writeCollection(collection.id);

  // Dispatch the collection created event
  Events.dispatch<CollectionCreatedEventData>(
    CollectionCreatedEvent,
    collection,
  );

  return collection;
}
