import { Collection, CollectionType } from '../types';

export const jsonCollection: Collection = {
  id: 'collection-1',
  type: CollectionType.JSON,
  path: 'Books',
  created: new Date(),
  lastModified: new Date(),
  name: 'Books',
  itemName: 'Book',
  description: 'A collection of books',
};

export const markdownCollection: Collection = {
  id: 'collection-2',
  type: CollectionType.Markdown,
  path: 'Notes',
  created: new Date(),
  lastModified: new Date(),
  name: 'Notes',
  itemName: 'Note',
};

export const fileCollection: Collection = {
  id: 'collection-3',
  type: CollectionType.File,
  path: 'PDFs',
  created: new Date(),
  lastModified: new Date(),
  name: 'PDFs',
  itemName: 'PDF',
};

export const weblinkCollection: Collection = {
  id: 'collection-4',
  type: CollectionType.Weblink,
  path: 'Bookmarks',
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
