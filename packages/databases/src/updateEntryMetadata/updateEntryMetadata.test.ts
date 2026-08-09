import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
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
import { databaseMetadataFilePath, entryMetadataKey } from '../utils';
import {
  flushDatabaseMetadata,
  rekeyPendingMetadata,
  updateEntryMetadata,
} from './updateEntryMetadata';

const metadataFilePath = databaseMetadataFilePath(objectDatabase.path);

// The database-relative keys the entries' metadata is stored under
const objectMetadataKey = entryMetadataKey(
  objectEntry1.path,
  objectDatabase.path,
);
const urlMetadataKey = entryMetadataKey(urlEntry1.path, urlDatabase.path);

const entryMetadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: {
    'card:Tasks': {
      options: { columns: [['a', 'b'], ['c']] },
      data: {},
    },
  },
};

describe('updateEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the metadata on the stored entry', () => {
    updateEntryMetadata(objectEntry1.id, entryMetadata);

    // The store entry should reflect the updated metadata
    expect(DatabaseEntriesStore.get(objectEntry1.id)?.metadata).toEqual(
      entryMetadata,
    );
  });

  it('creates the metadata file if it does not exist', async () => {
    updateEntryMetadata(objectEntry1.id, entryMetadata);
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written).toEqual({
      [objectMetadataKey]: entryMetadata,
    });
  });

  it('preserves other entries when updating', async () => {
    const existingMetadata: Record<string, DatabaseEntryMetadata> = {
      'Other Entry.md': {
        embeddedViewConfigs: { 'list:Tags': { options: {}, data: {} } },
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
      [objectMetadataKey]: entryMetadata,
    });
  });

  it('merges successive updates for the same database into one write', async () => {
    const metadata1: DatabaseEntryMetadata = {
      embeddedViewConfigs: { 'card:Tags': { options: {}, data: {} } },
    };
    const metadata2: DatabaseEntryMetadata = {
      embeddedViewConfigs: { 'list:Status': { options: {}, data: {} } },
    };

    // Queue two updates for different entries in the same database
    updateEntryMetadata(objectEntry1.id, metadata1);
    updateEntryMetadata(urlEntry1.id, metadata2);

    // Flush the object database (objectEntry1's database)
    await flushDatabaseMetadata(objectDatabase.path);

    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    // Only objectEntry1's metadata is in the object database's file
    expect(written[objectMetadataKey]).toEqual(metadata1);
    expect(Object.keys(written)).toEqual([objectMetadataKey]);

    // Flush the url database separately
    await flushDatabaseMetadata(urlDatabase.path);

    const urlMetadataFilePath = databaseMetadataFilePath(urlDatabase.path);
    const urlWritten = JSON.parse(MockFs.readTextFile(urlMetadataFilePath));

    expect(urlWritten[urlMetadataKey]).toEqual(metadata2);
  });

  it('is a no-op when flushing a database with no pending updates', async () => {
    // Should not throw or create any files
    await flushDatabaseMetadata(objectDatabase.path);

    expect(MockFs.exists(metadataFilePath)).toBe(false);
  });

  describe('rekeyPendingMetadata', () => {
    it('moves a pending entry from the old key to the new key', async () => {
      const newKey = 'Renamed Entry.md';

      // Queue metadata under the original entry's key
      updateEntryMetadata(objectEntry1.id, entryMetadata);

      // Re-key from old to new
      rekeyPendingMetadata(objectDatabase.path, objectMetadataKey, newKey);

      // Flush and verify the metadata was written under the new key
      await flushDatabaseMetadata(objectDatabase.path);

      const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

      expect(written[newKey]).toEqual(entryMetadata);
      expect(written[objectMetadataKey]).toBeUndefined();
    });

    it('is a no-op when there are no pending updates for the database', () => {
      // Should not throw
      rekeyPendingMetadata(objectDatabase.path, objectMetadataKey, 'new-id');
    });

    it('is a no-op when the old key does not exist in pending updates', async () => {
      // Queue metadata under the entry's key
      updateEntryMetadata(objectEntry1.id, entryMetadata);

      // Try to re-key a non-existent key
      rekeyPendingMetadata(objectDatabase.path, 'non-existent', 'new-id');

      // Flush and verify the original entry is unchanged
      await flushDatabaseMetadata(objectDatabase.path);

      const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

      expect(written[objectMetadataKey]).toEqual(entryMetadata);
    });
  });
});
