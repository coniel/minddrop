import { Collection, CollectionType } from '../types';

export const collectionsPath = 'path/to/collections';

export const itemsCollection: Collection = {
  type: CollectionType.Items,
  created: new Date(),
  lastModified: new Date(),
  name: 'Books',
  itemName: 'Book',
  description: 'A collection of books',
};

export const markdownCollection: Collection = {
  type: CollectionType.Notes,

  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
};

export const fileCollection: Collection = {
  type: CollectionType.Files,
  created: new Date(),
  lastModified: new Date(),
  name: 'PDFs',
  itemName: 'PDF',
};

export const weblinkCollection: Collection = {
  type: CollectionType.Weblinks,
  created: new Date(),
  lastModified: new Date(),
  name: 'Bookmarks',
  itemName: 'Bookmark',
};

export const collections = [
  itemsCollection,
  markdownCollection,
  fileCollection,
  weblinkCollection,
];

export const collectionFiles = collections.map((collection) => ({
  path: `${collectionsPath}/${collection.name}/.minddrop/collection.json`,
  textContent: JSON.stringify(collection),
}));
