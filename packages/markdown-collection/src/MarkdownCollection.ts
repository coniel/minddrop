import { CollectionTypeConfig } from '@minddrop/collections';
import { createMarkdownCollectionEntry } from './createMarkdownCollectionEntry';
import { getAllMarkdownCollectionEntries } from './getAllMarkdownCollectionEntries';

export const MarkdownCollection: CollectionTypeConfig = {
  id: 'markdown',
  description: {
    'en-GB': {
      name: 'Markdown',
      details: 'Markdown file based collection.',
    },
  },
  getAllEntries: getAllMarkdownCollectionEntries,
  getEntry: async () => ({}) as any,
  createEntry: createMarkdownCollectionEntry,
  deleteEntry: async () => {},
  setEntryProperties: async () => ({}) as any,
  archiveEntry: async () => ({}) as any,
  restoreEntry: async () => ({}) as any,
  renameEntry: async () => ({}) as any,
};
