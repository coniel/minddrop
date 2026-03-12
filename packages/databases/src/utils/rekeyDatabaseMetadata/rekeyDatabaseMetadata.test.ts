import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
import { DatabaseEntryMetadata } from '../../types';
import { databaseMetadataFilePath } from '../databaseMetadataFilePath';
import { rekeyDatabaseMetadata } from './rekeyDatabaseMetadata';

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

const entryMetadata: DatabaseEntryMetadata = {
  views: {
    'card:Tasks': {
      options: { columns: [['a', 'b'], ['c']] },
      data: {},
    },
  },
};

describe('rekeyDatabaseMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('re-keys an entry in the metadata file from old ID to new ID', async () => {
    const newEntryId = `${objectDatabase.name}/Renamed Entry.md`;

    // Write an initial metadata file with the old entry ID
    MockFs.addFiles([
      {
        path: metadataFilePath,
        textContent: JSON.stringify({ [objectEntry1.id]: entryMetadata }),
      },
    ]);

    // Re-key from old to new
    await rekeyDatabaseMetadata(
      objectDatabase.path,
      objectEntry1.id,
      newEntryId,
    );

    // Verify the metadata is now under the new key
    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[newEntryId]).toEqual(entryMetadata);
    expect(written[objectEntry1.id]).toBeUndefined();
  });

  it('preserves other entries when re-keying', async () => {
    const otherEntryId = 'Objects/Other Entry.md';
    const otherMetadata: DatabaseEntryMetadata = {
      views: { 'list:Tags': { options: {}, data: {} } },
    };
    const newEntryId = `${objectDatabase.name}/Renamed Entry.md`;

    // Write metadata with two entries
    MockFs.addFiles([
      {
        path: metadataFilePath,
        textContent: JSON.stringify({
          [objectEntry1.id]: entryMetadata,
          [otherEntryId]: otherMetadata,
        }),
      },
    ]);

    await rekeyDatabaseMetadata(
      objectDatabase.path,
      objectEntry1.id,
      newEntryId,
    );

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    // New key has the re-keyed data
    expect(written[newEntryId]).toEqual(entryMetadata);
    // Other entry is untouched
    expect(written[otherEntryId]).toEqual(otherMetadata);
    // Old key is gone
    expect(written[objectEntry1.id]).toBeUndefined();
  });

  it('is a no-op when the old key does not exist in the metadata file', async () => {
    // Write metadata without the entry we are trying to re-key
    MockFs.addFiles([
      {
        path: metadataFilePath,
        textContent: JSON.stringify({
          'Objects/Other Entry.md': entryMetadata,
        }),
      },
    ]);

    await rekeyDatabaseMetadata(objectDatabase.path, objectEntry1.id, 'new-id');

    // File should be unchanged
    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written['Objects/Other Entry.md']).toEqual(entryMetadata);
    expect(written[objectEntry1.id]).toBeUndefined();
    expect(written['new-id']).toBeUndefined();
  });

  it('is a no-op when no metadata file exists', async () => {
    // Should not throw when there is no metadata file
    await rekeyDatabaseMetadata(objectDatabase.path, objectEntry1.id, 'new-id');

    // No file should have been created
    expect(MockFs.exists(metadataFilePath)).toBe(false);
  });
});
