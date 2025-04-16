import { CollectionTypeConfig } from '@minddrop/collections';
import { createMarkdownCollectionEntry } from './createMarkdownCollectionEntry';
import { getAllMarkdownCollectionEntries } from './getAllMarkdownCollectionEntries';
import { updateMarkdownCollectionEntry } from './updateMarkdownCollectionEntry';

export const MarkdownCollection: CollectionTypeConfig = {
  id: 'markdown',
  description: {
    'en-GB': {
      name: 'Markdown',
      details: 'Markdown file based collection.',
    },
  },
  getAllEntries: getAllMarkdownCollectionEntries,
  createEntry: createMarkdownCollectionEntry,
  updateEntry: updateMarkdownCollectionEntry,
  getEntry: async () => ({}) as any,
  deleteEntry: async () => {},
  archiveEntry: async () => ({}) as any,
  restoreEntry: async () => ({}) as any,
  renameEntry: async () => ({}) as any,
};
