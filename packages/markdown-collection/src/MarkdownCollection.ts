import { CollectionTypeConfig } from '@minddrop/collections';
import { createMarkdownCollectionEntry } from './createMarkdownCollectionEntry';

export const MarkdownCollection: CollectionTypeConfig = {
  id: 'markdown',
  description: {
    'en-GB': {
      name: 'Markdown',
      details: 'Markdown file based collection.',
    },
  },
  getAllEntries: async () => [],
  getEntry: async () => ({}) as any,
  createEntry: createMarkdownCollectionEntry,
  deleteEntry: async () => {},
  setEntryProperties: async () => ({}) as any,
  archiveEntry: async () => ({}) as any,
  restoreEntry: async () => ({}) as any,
  renameEntry: async () => ({}) as any,
};
