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

export const notesCollectionConfig: CollectionConfig = {
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
export const notesCollectionPath = `${collectionsPath}/${notesCollectionConfig.name}`;
export const fileCollectionPath = `${collectionsPath}/${fileCollectionConfig.name}`;
export const weblinkCollectionPath = `${collectionsPath}/${weblinkCollectionConfig.name}`;

export const itemsCollection: Collection = {
  ...itemsCollectionConfig,
  path: itemsCollectionPath,
};
export const notesCollection: Collection = {
  ...notesCollectionConfig,
  path: notesCollectionPath,
};
export const fileCollection: Collection = {
  ...fileCollectionConfig,
  path: fileCollectionPath,
};
export const weblinkCollection: Collection = {
  ...weblinkCollectionConfig,
  path: weblinkCollectionPath,
};

export const itemsCollectionConfigPath = `${itemsCollectionPath}/.minddrop/collection.json`;
export const notesCollectionConfigPath = `${notesCollectionPath}/.minddrop/collection.json`;
export const fileCollectionConfigPath = `${fileCollectionPath}/.minddrop/collection.json`;
export const weblinkCollectionConfigPath = `${weblinkCollectionPath}/.minddrop/collection.json`;

export const itemsCollectionFileDescriptor: MockFileDescriptor = {
  path: itemsCollectionConfigPath,
  textContent: JSON.stringify(itemsCollectionConfig),
};
export const notesCollectionFileDescriptor: MockFileDescriptor = {
  path: notesCollectionConfigPath,
  textContent: JSON.stringify(notesCollectionConfig),
};
export const fileCollectionFileDescriptor: MockFileDescriptor = {
  path: fileCollectionConfigPath,
  textContent: JSON.stringify(fileCollectionConfig),
};
export const weblinkCollectionFileDescriptor: MockFileDescriptor = {
  path: weblinkCollectionConfigPath,
  textContent: JSON.stringify(weblinkCollectionConfig),
};

export const collections = [
  itemsCollection,
  notesCollection,
  fileCollection,
  weblinkCollection,
];

export const collectionConfigs = [
  itemsCollectionConfig,
  notesCollectionConfig,
  fileCollectionConfig,
  weblinkCollectionConfig,
];

export const collectionFiles = [
  itemsCollectionFileDescriptor,
  notesCollectionFileDescriptor,
  fileCollectionFileDescriptor,
  weblinkCollectionFileDescriptor,
];

export const collectionsConfig: CollectionsConfig = {
  paths: [
    itemsCollectionPath,
    notesCollectionPath,
    fileCollectionPath,
    weblinkCollectionPath,
  ],
};

export const workspcesConfigFileDescriptor: MockFileDescriptor = {
  path: CollectionsConfigFileName,
  textContent: JSON.stringify(collectionsConfig),
  options: { baseDir: CollectionsConfigDir },
};
