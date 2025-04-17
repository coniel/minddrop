import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionEntryNotFoundError } from '@minddrop/collections';
import {
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { MarkdownCollectionMetadataDir } from '../../constants';
import {
  cleanup,
  collectionMetadataPath,
  markdownCollection,
  markdownEntry,
  markdownEntryFileDescriptor,
  markdownEntryMetadataFileDescriptor,
  setup,
} from '../test-utils';
import { renameMarkdownCollectionEntry } from './renameMarkdownCollectionEntry';

const MockFs = initializeMockFileSystem([
  markdownCollection.path,
  markdownEntryFileDescriptor,
  collectionMetadataPath,
  markdownEntryMetadataFileDescriptor,
]);

const newPath = `${markdownCollection.path}/New Title.md`;
const newMetadataPath = `${markdownCollection.path}/${MarkdownCollectionMetadataDir}/New Title.json`;
const updatedMarkdown = `---\nfoo: bar\n---\n\n# New Title`;

const retitledEntry = {
  ...markdownEntry,
  path: newPath,
  title: 'New Title',
  metadata: {
    ...markdownEntry.metadata,
    lastModified: new Date('2023-01-01'),
  },
  content: '# New Title',
};

describe('renameMarkdownCollectionEntry', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('throws if the entry file does not exist', async () => {
    expect(() =>
      renameMarkdownCollectionEntry(
        {
          ...markdownEntry,
          path: 'missing.md',
        },
        'New Title',
        markdownEntry.metadata,
      ),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('throws if the new file path already exists', async () => {
    MockFs.writeTextFile(newPath, 'Existing file content');

    expect(() =>
      renameMarkdownCollectionEntry(
        markdownEntry,
        'New Title',
        markdownEntry.metadata,
      ),
    ).rejects.toThrow(PathConflictError);
  });

  it('renames the entry markdown file', async () => {
    await renameMarkdownCollectionEntry(
      markdownEntry,
      'New Title',
      markdownEntry.metadata,
    );

    expect(MockFs.exists(newPath)).toBe(true);
    expect(MockFs.exists(markdownEntry.path)).toBe(false);
  });

  it('renames the entry metadata file', async () => {
    await renameMarkdownCollectionEntry(
      markdownEntry,
      'New Title',
      markdownEntry.metadata,
    );

    expect(MockFs.exists(newMetadataPath)).toBe(true);
    expect(MockFs.exists(markdownEntryMetadataFileDescriptor.path)).toBe(false);
  });

  it('updates the entry markdown header with the new title', async () => {
    await renameMarkdownCollectionEntry(
      markdownEntry,
      'New Title',
      markdownEntry.metadata,
    );

    const updatedContent = MockFs.readTextFile(newPath);

    expect(updatedContent).toMatch(updatedMarkdown);
  });

  it('updates the entry metadata file', async () => {
    await renameMarkdownCollectionEntry(
      markdownEntry,
      'New Title',
      markdownEntry.metadata,
    );

    const updatedMetadata = JSON.parse(MockFs.readTextFile(newMetadataPath));
    updatedMetadata.lastModified = new Date(updatedMetadata.lastModified);
    updatedMetadata.created = new Date(updatedMetadata.created);

    expect(updatedMetadata).toEqual(retitledEntry.metadata);
  });

  it('returns the updated entry', async () => {
    const result = await renameMarkdownCollectionEntry(
      markdownEntry,
      'New Title',
      markdownEntry.metadata,
    );

    expect(result).toEqual(retitledEntry);
  });
});
