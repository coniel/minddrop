import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  databaseEntryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../test-utils';
import { resolveEntryMetadataFilePath } from '../utils';
import { updateEntryPropertyMetadata } from './updateEntryPropertyMetadata';

// The sidecar path the entry's metadata is written to
const sidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(objectDatabase),
  databaseEntryFilePath(objectEntry1),
);

describe('updateEntryPropertyMetadata', () => {
  beforeEach(() => {
    setup();

    // Give two of the entry's properties metadata
    DatabaseEntriesStore.update(objectEntry1.id, {
      metadata: {
        color: 'blue',
        properties: {
          Paper: { annotations: [], page: 3 },
          Cover: { crop: 'square' },
        },
      },
    });
  });

  afterEach(cleanup);

  it("merges the data into the property's metadata", async () => {
    await updateEntryPropertyMetadata(objectEntry1.id, 'Paper', { page: 7 });

    expect(storeItem(DatabaseEntriesStore, objectEntry1.id).metadata).toEqual({
      color: 'blue',
      properties: {
        Paper: { annotations: [], page: 7 },
        Cover: { crop: 'square' },
      },
    });
  });

  it('adds metadata to a property without any', async () => {
    await updateEntryPropertyMetadata(objectEntry1.id, 'Photo', { crop: 1 });

    expect(
      storeItem(DatabaseEntriesStore, objectEntry1.id).metadata.properties
        ?.Photo,
    ).toEqual({ crop: 1 });
  });

  it('writes the metadata sidecar', async () => {
    await updateEntryPropertyMetadata(objectEntry1.id, 'Paper', { page: 7 });

    expect(
      JSON.parse(MockFs.readTextFile(sidecarPath)).properties.Paper,
    ).toEqual({ annotations: [], page: 7 });
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      updateEntryPropertyMetadata('missing', 'Paper', { page: 7 }),
    ).rejects.toThrow(DatabaseEntryNotFoundError);
  });
});
