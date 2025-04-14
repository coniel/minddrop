import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionEntry } from '@minddrop/collections';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { i18n } from '@minddrop/i18n';
import { MarkdownCollectionMetadataDir } from '../../constants';
import { createMarkdownCollectionEntry } from '../createMarkdownCollectionEntry';
import {
  cleanup,
  collectionFileDescriptors,
  collectionPath,
  setup,
} from '../test-utils';
import { getAllMarkdownCollectionEntries } from './getAllMarkdownCollectionEntries';

const UNTITLED = i18n.t('documents.untitled');

const MockFs = initializeMockFileSystem(collectionFileDescriptors);

const properties = { foo: 'bar' };
const metadata = { bar: 'baz' };
const entry: CollectionEntry = {
  title: UNTITLED,
  path: `${UNTITLED}.md`,
  collectionPath,
  properties,
  metadata,
  markdown: `# ${UNTITLED}`,
};

describe('getAllMarkdownCollectionEntries', () => {
  beforeEach(async () => {
    setup();

    // Create some collection entries
    await createMarkdownCollectionEntry(collectionPath, properties, metadata);
    await createMarkdownCollectionEntry(collectionPath, properties, metadata);
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('returns all entries in the markdown collection', async () => {
    const entries = await getAllMarkdownCollectionEntries(collectionPath);

    expect(entries.length).toBe(2);
    expect(entries[0]).toEqual(entry);
  });

  it('gracefully handles missing metadata files', async () => {
    // Delete the metadata file for the first entry
    MockFs.removeFile(
      Fs.concatPath(
        collectionPath,
        MarkdownCollectionMetadataDir,
        `${UNTITLED}.json`,
      ),
    );

    const entries = await getAllMarkdownCollectionEntries(collectionPath);

    expect(entries.length).toBe(2);
    expect(entries[0]).toEqual({
      ...entry,
      metadata: {},
    });
  });
});
