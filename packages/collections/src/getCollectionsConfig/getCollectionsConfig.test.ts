import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FileNotFoundError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { JsonParseError } from '@minddrop/utils';
import {
  cleanup,
  collectionsConfig,
  collectionsConfigFileDescriptor,
  setup,
} from '../test-utils';
import { getCollectionsConfig } from './getCollectionsConfig';

const MockFs = initializeMockFileSystem([
  // Collections cinfig file
  collectionsConfigFileDescriptor,
]);

describe('getCollectionsConfig', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the collections config file does not exist', () => {
    // Pretend collections file does not exist
    MockFs.clear();

    // Should throw a FileNotFoundError
    expect(() => getCollectionsConfig()).rejects.toThrowError(
      FileNotFoundError,
    );
  });

  it('throws if the collections config file could not be parsed', () => {
    // Pretend collections config file contains invalid JSON
    MockFs.setFiles([
      {
        ...collectionsConfigFileDescriptor,
        textContent: 'foo',
      },
    ]);

    // Should throw a JsonParseError
    expect(() => getCollectionsConfig()).rejects.toThrowError(JsonParseError);
  });

  it('returns parsed contents of collections config file', async () => {
    // Get collections config
    const config = await getCollectionsConfig();

    // Should return parsed file contents
    expect(config).toEqual(collectionsConfig);
  });
});
