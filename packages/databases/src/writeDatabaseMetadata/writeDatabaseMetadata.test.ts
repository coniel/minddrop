import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import { databaseMetadataFilePath } from '../utils';
import { writeDatabaseMetadata } from './writeDatabaseMetadata';

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

const metadataMap: Record<string, DatabaseEntryMetadata> = {
  [objectEntry1.id]: {
    views: {
      'card:Tasks': {
        options: { columns: [['a', 'b'], ['c']] },
        data: {},
      },
    },
  },
};

describe('writeDatabaseMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('writes the metadata map to the metadata file', async () => {
    // Ensure the parent directory exists
    MockFs.addFiles([metadataFilePath]);

    await writeDatabaseMetadata(objectDatabase.path, metadataMap);

    // Read the file back and verify contents
    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written).toEqual(metadataMap);
  });
});
