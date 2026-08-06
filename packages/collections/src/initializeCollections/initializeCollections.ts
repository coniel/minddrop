import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { I18n } from '@minddrop/i18n';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
  resolveItemReferences,
} from '@minddrop/item-references';
import { restoreDates } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionFileExtension } from '../constants';
import { onItemAddressesChanged } from '../event-handlers';
import { CollectionsLoadedEvent, CollectionsLoadedEventData } from '../events';
import { locales } from '../locales';
import { readCollection } from '../readCollection';
import { Collection } from '../types';
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
  const rawCollections = collectionPromises.filter(
    (collection) => collection !== null,
  );

  // Restore serialized dates and resolve durable item
  // references back into item IDs
  const collections = rawCollections.map((collection) => ({
    ...restoreDates<Collection>(collection),
    items: resolveItemReferences(collection.items),
  }));

  // Load the collections into the store
  CollectionsStore.load(collections);

  // Rewrite collection files when member item addresses change
  Events.on<ItemAddressesChangedEventData>(
    ItemAddressesChangedEvent,
    'collections',
    ({ data }) => onItemAddressesChanged(data),
  );

  // Dispatch a collections loaded event
  Events.dispatch<CollectionsLoadedEventData>(
    CollectionsLoadedEvent,
    collections,
  );
}
