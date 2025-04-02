import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { getCollectionFromPath } from '../getCollectionFromPath';
import { getCollectionsConfig } from '../getCollectionsConfig';
import { Collection } from '../types';

/**
 * Loads the user's collections into the collections store.
 *
 * Dispatches a 'collections:load' event.
 *
 * @returns The loaded collections.
 *
 * @throws {FileNotFoundError} - Collections config file not found.
 * @throws {JsonParseError} - Failed to parse collections config file.
 */
export async function loadCollections(): Promise<Collection[]> {
  // Get the user's collections config
  const collectionsConfig = await getCollectionsConfig();

  // If there are no paths, there is nothing to load
  if (collectionsConfig.paths.length === 0) {
    return [];
  }

  // Get collections listed in the config
  const configCollections: Collection[] = await Promise.all(
    collectionsConfig.paths.map(getCollectionFromPath),
  );

  // Get the existing collections from the store
  const existingCollections = Object.values(
    CollectionsStore.getState().collections,
  );

  // Filter out the existing collections from the config's
  // collections. Note: we filter out existing collections only
  // after fetching all of them because the existing collections
  // may have changed in the time it takes to complete the
  // async processes above.
  const newCollections = configCollections.filter(
    (collection) =>
      !existingCollections.find(({ path }) => collection.path === path),
  );

  // If there are no new collections, there is nothing to load
  if (newCollections.length === 0) {
    return [];
  }

  // Load collection paths into store
  CollectionsStore.getState().load(newCollections);

  // Dispatch a 'collections:load' event
  Events.dispatch('collections:load', newCollections);

  return newCollections;
}
