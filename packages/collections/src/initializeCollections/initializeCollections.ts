import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { I18n } from '@minddrop/i18n';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionFileExtension } from '../constants';
import { CollectionsLoadedEvent, CollectionsLoadedEventData } from '../events';
import { locales } from '../locales';
import { readCollection } from '../readCollection';
import { getCollectionsDirPath } from '../utils';

/**
 * Initializes collections by loading collection configs from the collections
 * directory.
 *
 * If the collections directory does not exist, it will be created.
 */
export async function initializeCollections(): Promise<void> {
  // Register collection translations
  I18n.registerTranslations(locales);

  const collectionsDirPath = getCollectionsDirPath();

  // Ensure that the collections directory exists
  await Fs.ensureDir(collectionsDirPath);

  // Load collections from the collections directory
  const files = await Fs.readDir(collectionsDirPath);

  // Filter out files that are not collection configs
  const collectionFilePaths = files
    .filter((file) => file.path.endsWith(CollectionFileExtension))
    .map((file) => file.path);

  // Read the collection files
  const collectionPromises = await Promise.all(
    collectionFilePaths.map((path) => readCollection(path)),
  );

  // Filter out null collections
  const collections = collectionPromises.filter(
    (collection) => collection !== null,
  );

  // Load the collections into the store
  CollectionsStore.load(collections);

  // Dispatch a collections loaded event
  Events.dispatch<CollectionsLoadedEventData>(
    CollectionsLoadedEvent,
    collections,
  );
}
