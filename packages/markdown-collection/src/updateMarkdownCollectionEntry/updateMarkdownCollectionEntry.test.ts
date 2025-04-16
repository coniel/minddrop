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
import { getMarkdownEntryMetadataFilePath } from '../utils';
import { updateMarkdownCollectionEntry } from './updateMarkdownCollectionEntry';

const MockFs = initializeMockFileSystem([
  markdownCollection.path,
  markdownEntryFileDescriptor,
  collectionMetadataPath,
  markdownEntryMetadataFileDescriptor,
]);

const updatedEntry = {
  ...markdownEntry,
  properties: {
    foo: 'updated',
  },
  metadata: {
    ...markdownEntry.metadata,
    lastModified: new Date(),
  },
  content: '# Updated Entry 1',
};

const missingEntry = {
  ...updatedEntry,
  title: 'Missing Entry',
  path: `${markdownCollection.path}/Missing Entry.md`,
};

const updatedMarkdown = `---\nfoo: updated\n---\n\n# Updated Entry 1`;

describe('updateMarkdownCollectionEntry', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('updates properties and content in the markdown file', async () => {
    await updateMarkdownCollectionEntry(updatedEntry);

    const updatedContent = MockFs.readTextFile(markdownEntry.path);

    expect(updatedContent).toMatch(updatedMarkdown);
  });

  it('updates the metadata file', async () => {
    await updateMarkdownCollectionEntry(updatedEntry);

    const updatedMetadata = JSON.parse(
      MockFs.readTextFile(markdownEntryMetadataFileDescriptor.path),
    );

    expect(updatedMetadata.lastModified).toBeDefined();
    expect(
      new Date(updatedMetadata.lastModified) >
        markdownEntry.metadata.lastModified,
    ).toBeTruthy();
  });

  it('returns the updated entry', async () => {
    const result = await updateMarkdownCollectionEntry(updatedEntry);

    expect(result).toEqual(updatedEntry);
  });

  it('creates the markdown file if it does not exist', async () => {
    await updateMarkdownCollectionEntry(missingEntry);

    const updatedContent = MockFs.readTextFile(missingEntry.path);

    expect(updatedContent).toBe(updatedMarkdown);
  });

  it('creates the metadata file if it does not exist', async () => {
    await updateMarkdownCollectionEntry(missingEntry);

    const updatedMetadata = JSON.parse(
      MockFs.readTextFile(getMarkdownEntryMetadataFilePath(missingEntry)),
    );

    expect(updatedMetadata.lastModified).toBeDefined();
    expect(new Date(updatedMetadata.lastModified)).toEqual(
      missingEntry.metadata.lastModified,
    );
  });
});
