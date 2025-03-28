import { Collection, CollectionType } from '../types';

export const collectionsPath = 'path/to/collections';

export const jsonCollection: Collection = {
  type: CollectionType.JSON,
  created: new Date(),
  lastModified: new Date(),
  name: 'Books',
  itemName: 'Book',
  description: 'A collection of books',
};

export const markdownCollection: Collection = {
  type: CollectionType.Markdown,
  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
};

export const fileCollection: Collection = {
  type: CollectionType.File,
  created: new Date(),
  lastModified: new Date(),
  name: 'PDFs',
  itemName: 'PDF',
};

export const weblinkCollection: Collection = {
  type: CollectionType.Weblink,
  created: new Date(),
  lastModified: new Date(),
  name: 'Bookmarks',
  itemName: 'Bookmark',
};

export const collections = [
  jsonCollection,
  markdownCollection,
  fileCollection,
  weblinkCollection,
];

export const collectionFiles = collections.map((collection) => ({
  path: `${collectionsPath}/${collection.name}/.minddrop/collection.json`,
  textContent: JSON.stringify(collection),
}));
