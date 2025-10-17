import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionsStore } from '../CollectionsStore';
import {
  cleanup,
  linkCollectionTypeConfig,
  linksCollection,
  setup,
} from '../test-utils';
import { createCollectionEntryFromString } from './createCollectionEntryFromString';

const MockFs = initializeMockFileSystem([linksCollection.path]);

describe('createCollectionEntryFromString', () => {
  beforeEach(() => {
    setup();

    CollectionTypeConfigsStore.add(linkCollectionTypeConfig);
    CollectionsStore.getState().add(linksCollection);
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('creates a collection entry from a string', async () => {
    const urlString = 'https://www.minddrop.app';

    const entry = await createCollectionEntryFromString(urlString);

    // The links collection type config matches URL strings
    expect(entry?.collectionPath).toBe(linksCollection.path);
  });

  it('returns null if no matching collection is found', async () => {
    const nonMatchingString = 'This string does not match any collection';

    const entry = await createCollectionEntryFromString(nonMatchingString);

    expect(entry).toBeNull();
  });
});
