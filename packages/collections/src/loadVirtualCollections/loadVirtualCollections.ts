import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';

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
   * The item IDs in the collection.
   */
  items: string[];
}

/**
 * Loads virtual collections into a workspace's store record without
 * dispatching creation events. Use this when hydrating virtual
 * collections from existing data (e.g. loading entry collection
 * properties).
 *
 * @param data - The virtual collection data to load.
 * @param workspaceId - The ID of the workspace the collections belong to.
 */
export function loadVirtualCollections(
  data: VirtualCollectionData[],
  workspaceId: string,
): void {
  // Generate virtual collection objects from the data
  const collections = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
  }));

  CollectionsStore.in(workspaceId).load(collections);

  // Dispatch a collections loaded event
  Events.dispatch(CollectionsLoadedEvent, collections);
}
