import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollectionsConfig } from '../getCollectionsConfig';
import {
  cleanup,
  collectionsConfig,
  itemsCollection,
  setup,
  workspcesConfigFileDescriptor,
} from '../test-utils';
import { writeCollectionsConfig } from './writeCollectionsConfig';

const MockFs = initializeMockFileSystem([
  // Collections config file
  {
    ...workspcesConfigFileDescriptor,
    textContent: JSON.stringify({ ...collectionsConfig, paths: [] }),
  },
]);

describe('writeCollectionsConfig', () => {
  beforeEach(() => {
    setup();

    // Load collections into the store
    CollectionsStore.getState().load([itemsCollection]);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('writes collection paths to the config file', async () => {
    // Write current collections state to config file
    await writeCollectionsConfig();

    // Get collections config
    const config = await getCollectionsConfig();

    // Should contain collection paths
    expect(config.paths).toEqual([itemsCollection.path]);
  });
});
