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
});
