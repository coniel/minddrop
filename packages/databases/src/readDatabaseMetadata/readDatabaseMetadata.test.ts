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
import { readDatabaseMetadata } from './readDatabaseMetadata';

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

describe('readDatabaseMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns an empty map if the metadata file does not exist', async () => {
    const metadata = await readDatabaseMetadata(objectDatabase.path);

    expect(metadata).toEqual({});
  });

  it('reads and parses the metadata file', async () => {
    // Write a metadata file
    MockFs.addFiles([
      {
        path: metadataFilePath,
        textContent: JSON.stringify(metadataMap),
      },
    ]);

    const metadata = await readDatabaseMetadata(objectDatabase.path);

    expect(metadata).toEqual(metadataMap);
  });
});
