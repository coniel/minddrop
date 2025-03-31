import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { cleanup, setup, workspcesConfigFileDescriptor } from '../test-utils';
import { hasCollectionsConfig } from './hasCollectionsConfig';

const MockFs = initializeMockFileSystem([
  // Collections config file
  workspcesConfigFileDescriptor,
]);

describe('hasCollectionsConfig', () => {
  beforeEach(() => {
    setup();

    // Resert mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('returns true if the collections config file exists', async () => {
    // Should return true
    expect(await hasCollectionsConfig()).toBe(true);
  });

  it('returns false if the collections config file does not exist', async () => {
    // Pretend collections config file does not exist
    MockFs.clear();

    // Should return false
    expect(await hasCollectionsConfig()).toBe(false);
  });
});
