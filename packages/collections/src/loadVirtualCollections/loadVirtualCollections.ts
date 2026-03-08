import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent, CollectionsLoadedEventData } from '../events';

export interface VirtualCollectionData {
  /**
   * The unique identifier for the collection.
   */
  id: string;

  /**
   * The name of the collection.
   */
  name: string;

  /**
   * The entry IDs in the collection.
   */
  entries: string[];
}

/**
 * Loads virtual collections into the store without dispatching
 * creation events. Use this when hydrating virtual collections
 * from existing data (e.g. loading entry collection properties).
 *
 * @param data - The virtual collection data to load.
 */
export function loadVirtualCollections(data: VirtualCollectionData[]): void {
  // Generate virtual collection objects from the data
  const collections = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
  }));

  CollectionsStore.load(collections);

  // Dispatch a collections loaded event
  Events.dispatch<CollectionsLoadedEventData>(
    CollectionsLoadedEvent,
    collections,
  );
}
