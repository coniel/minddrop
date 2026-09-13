import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
import { restoreDates } from '@minddrop/utils';
import { Workspace } from '@minddrop/workspaces';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';
import { readCollection } from '../readCollection';
import { Collection } from '../types';
import { resolveCollectionsDirPath } from '../utils';

/**
 * Loads a workspace's collections from its collections directory
 * into the workspace's store record.
 *
 * If the collections directory does not exist, it will be created.
 *
 * @param workspace - The workspace whose collections to load.
 *
 * @dispatches collections:loaded
 */
export async function loadWorkspaceCollections(
  workspace: Workspace,
): Promise<void> {
  const collectionsDirPath = resolveCollectionsDirPath(workspace.path);

  // Ensure that the collections directory exists
  await Fs.ensureDir(collectionsDirPath);

  // Load collections from the collections directory
  const files = await Fs.readDir(collectionsDirPath);

  // Read the collection files
  const collectionPromises = await Promise.all(
    files.map((file) => readCollection(file.path)),
  );

  // Filter out null collections
  const rawCollections = collectionPromises.filter(
    (collection) => collection !== null,
  );

  // Restore serialized dates and resolve durable item
  // references back into item IDs.
  const collections = rawCollections.map((collection) => ({
    ...restoreDates<Collection>(collection),
    items: ItemReferences.resolve(collection.items, {
      workspaceId: workspace.id,
    }),
  }));

  // Load the collections into the workspace's store record
  CollectionsStore.in(workspace.id).load(collections);

  // Dispatch a collections loaded event
  Events.dispatch(CollectionsLoadedEvent, collections);
}
