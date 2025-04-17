import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  cleanup,
  collectionMetadataPath,
  markdownCollection,
  markdownEntry,
  markdownEntryFileDescriptor,
  markdownEntryMetadataFileDescriptor,
  setup,
} from '../test-utils';
import { deleteMarkdwnCollectionEntry } from './deleteMarkdwnCollectionEntry';

const MockFs = initializeMockFileSystem([
  markdownCollection.path,
  markdownEntryFileDescriptor,
  collectionMetadataPath,
  markdownEntryMetadataFileDescriptor,
]);

describe('deleteMarkdwnCollectionEntry', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('deletes the entry markdown file', async () => {
    await deleteMarkdwnCollectionEntry(markdownEntry);

    expect(MockFs.exists(markdownEntry.path)).toBe(false);
  });

  it('deletes the entry metadata file', async () => {
    await deleteMarkdwnCollectionEntry(markdownEntry);

    expect(MockFs.exists(markdownEntryMetadataFileDescriptor.path)).toBe(false);
  });

  it('does nothing if the entry files do not exist', async () => {
    expect(() =>
      deleteMarkdwnCollectionEntry({
        ...markdownEntry,
        path: 'missing.md',
      }),
    ).not.toThrow();
  });
});
