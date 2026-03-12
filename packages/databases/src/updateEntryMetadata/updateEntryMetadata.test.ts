import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MockFs,
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  urlDatabase,
  urlEntry1,
} from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import { databaseMetadataFilePath } from '../utils';
import {
  flushDatabaseMetadata,
  rekeyPendingMetadata,
  updateEntryMetadata,
} from './updateEntryMetadata';

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

const entryMetadata: DatabaseEntryMetadata = {
  views: {
    'card:Tasks': {
      options: { columns: [['a', 'b'], ['c']] },
      data: {},
    },
  },
};

describe('updateEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates the metadata file if it does not exist', async () => {
    updateEntryMetadata(objectEntry1.id, entryMetadata);
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written).toEqual({
      [objectEntry1.id]: entryMetadata,
    });
  });

  it('preserves other entries when updating', async () => {
    const existingMetadata: Record<string, DatabaseEntryMetadata> = {
      'Objects/Other Entry.md': {
        views: { 'list:Tags': { options: {}, data: {} } },
      },
    };

    // Write an existing metadata file
    MockFs.addFiles([
      {
        path: metadataFilePath,
        textContent: JSON.stringify(existingMetadata),
      },
    ]);

    updateEntryMetadata(objectEntry1.id, entryMetadata);
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written).toEqual({
      ...existingMetadata,
      [objectEntry1.id]: entryMetadata,
    });
  });

  it('merges successive updates for the same database into one write', async () => {
    const metadata1: DatabaseEntryMetadata = {
      views: { 'card:Tags': { options: {}, data: {} } },
    };
    const metadata2: DatabaseEntryMetadata = {
      views: { 'list:Status': { options: {}, data: {} } },
    };

    // Queue two updates for different entries in the same database
    updateEntryMetadata(objectEntry1.id, metadata1);
    updateEntryMetadata(urlEntry1.id, metadata2);

    // Flush the object database (objectEntry1's database)
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[objectEntry1.id]).toEqual(metadata1);

    // urlEntry1 belongs to a different database, so it should not be in
    // this metadata file
    expect(written[urlEntry1.id]).toBeUndefined();

    // Flush the url database separately
    await flushDatabaseMetadata(urlDatabase.path);

    const urlMetadataFilePath = databaseMetadataFilePath(urlDatabase.path);
    const urlWritten = JSON.parse(MockFs.readTextFile(urlMetadataFilePath));

    expect(urlWritten[urlEntry1.id]).toEqual(metadata2);
  });

  it('is a no-op when flushing a database with no pending updates', async () => {
    // Should not throw or create any files
    await flushDatabaseMetadata(objectDatabase.path);

    expect(MockFs.exists(metadataFilePath)).toBe(false);
  });

  describe('rekeyPendingMetadata', () => {
    it('moves a pending entry from the old key to the new key', async () => {
      const newEntryId = `${objectDatabase.name}/Renamed Entry.md`;

      // Queue metadata under the original entry ID
      updateEntryMetadata(objectEntry1.id, entryMetadata);

      // Re-key from old to new
      rekeyPendingMetadata(objectDatabase.path, objectEntry1.id, newEntryId);

      // Flush and verify the metadata was written under the new key
      await flushDatabaseMetadata(objectDatabase.path);

      const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

      expect(written[newEntryId]).toEqual(entryMetadata);
      expect(written[objectEntry1.id]).toBeUndefined();
    });

    it('is a no-op when there are no pending updates for the database', () => {
      // Should not throw
      rekeyPendingMetadata(objectDatabase.path, objectEntry1.id, 'new-id');
    });

    it('is a no-op when the old key does not exist in pending updates', async () => {
      // Queue metadata under a different entry ID
      updateEntryMetadata(objectEntry1.id, entryMetadata);

      // Try to re-key a non-existent entry
      rekeyPendingMetadata(objectDatabase.path, 'non-existent', 'new-id');

      // Flush and verify the original entry is unchanged
      await flushDatabaseMetadata(objectDatabase.path);

      const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

      expect(written[objectEntry1.id]).toEqual(entryMetadata);
    });
  });
});
