import { MockFileDescriptor } from '@minddrop/file-system';
import { CollectionsConfigDir, CollectionsConfigFileName } from '../constants';
import {
  Collection,
  CollectionConfig,
  CollectionType,
  CollectionsConfig,
} from '../types';

export const collectionsPath = 'path/to/collections';

export const itemsCollectionConfig: CollectionConfig = {
  type: CollectionType.Items,
  created: new Date(),
  lastModified: new Date(),
  name: 'Books',
  itemName: 'Book',
  description: 'A collection of books',
};

export const markdownCollectionConfig: CollectionConfig = {
  type: CollectionType.Notes,

  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
};

export const fileCollectionConfig: CollectionConfig = {
  type: CollectionType.Files,
  created: new Date(),
  lastModified: new Date(),
  name: 'PDFs',
  itemName: 'PDF',
};

export const weblinkCollectionConfig: CollectionConfig = {
  type: CollectionType.Weblinks,
  created: new Date(),
  lastModified: new Date(),
  name: 'Bookmarks',
  itemName: 'Bookmark',
};

export const itemsCollectionPath = `${collectionsPath}/${itemsCollectionConfig.name}`;
export const markdownCollectionPath = `${collectionsPath}/${markdownCollectionConfig.name}`;
export const fileCollectionPath = `${collectionsPath}/${fileCollectionConfig.name}`;
export const weblinkCollectionPath = `${collectionsPath}/${weblinkCollectionConfig.name}`;

export const itemsCollection: Collection = {
  ...itemsCollectionConfig,
  path: itemsCollectionPath,
};
export const markdownCollection: Collection = {
  ...markdownCollectionConfig,
  path: markdownCollectionPath,
};
export const fileCollection: Collection = {
  ...fileCollectionConfig,
  path: fileCollectionPath,
};
export const weblinkCollection: Collection = {
  ...weblinkCollectionConfig,
  path: weblinkCollectionPath,
};

export const collections = [
  itemsCollection,
  markdownCollection,
  fileCollection,
  weblinkCollection,
];

export const collectionConfigs = [
  itemsCollectionConfig,
  markdownCollectionConfig,
  fileCollectionConfig,
  weblinkCollectionConfig,
];

export const collectionFiles = collections.map((collection) => ({
  path: `${collectionsPath}/${collection.name}/.minddrop/collection.json`,
  textContent: JSON.stringify(collection),
}));

export const collectionsConfig: CollectionsConfig = {
  paths: [
    itemsCollectionPath,
    markdownCollectionPath,
    fileCollectionPath,
    weblinkCollectionPath,
  ],
};

export const workspcesConfigFileDescriptor: MockFileDescriptor = {
  path: CollectionsConfigFileName,
  textContent: JSON.stringify(collectionsConfig),
  options: { baseDir: CollectionsConfigDir },
};
