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
import { resolveEntryMetadataFilePath } from '../utils';
import {
  flushAllEntryMetadata,
  flushEntryMetadata,
  rekeyPendingMetadata,
  updateEntryMetadata,
} from './updateEntryMetadata';

// The sidecar paths the entries' metadata is written to
const objectSidecarPath = resolveEntryMetadataFilePath(
  objectDatabase.path,
  objectEntry1.path,
);
const urlSidecarPath = resolveEntryMetadataFilePath(
  urlDatabase.path,
  urlEntry1.path,
);

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

  it('creates the sidecar if it does not exist', async () => {
    updateEntryMetadata(objectEntry1.id, entryMetadata);
    await flushEntryMetadata(objectEntry1.path);

    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      entryMetadata,
    );
  });

  it('writes the sidecar whole, replacing what it held', async () => {
    // Write a sidecar holding superseded metadata
    MockFs.addFiles([
      {
        path: objectSidecarPath,
        textContent: JSON.stringify({
          embeddedViewConfigs: { 'list:Tags': { options: {}, data: {} } },
        }),
      },
    ]);

    updateEntryMetadata(objectEntry1.id, entryMetadata);
    await flushEntryMetadata(objectEntry1.path);

    // A sidecar holds one entry's metadata, so there is nothing to
    // merge and the new value stands alone
    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      entryMetadata,
    );
  });

  it('keeps each entry to its own sidecar', async () => {
    const metadata1: DatabaseEntryMetadata = {
      embeddedViewConfigs: { 'card:Tags': { options: {}, data: {} } },
    };
    const metadata2: DatabaseEntryMetadata = {
      embeddedViewConfigs: { 'list:Status': { options: {}, data: {} } },
    };

    // Queue updates for entries in different databases
    updateEntryMetadata(objectEntry1.id, metadata1);
    updateEntryMetadata(urlEntry1.id, metadata2);

    await flushAllEntryMetadata();

    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      metadata1,
    );
    expect(JSON.parse(MockFs.readTextFile(urlSidecarPath))).toEqual(metadata2);
  });

  it('keeps only the last of successive updates to one entry', async () => {
    const superseded: DatabaseEntryMetadata = {
      embeddedViewConfigs: { 'card:Tags': { options: {}, data: {} } },
    };

    updateEntryMetadata(objectEntry1.id, superseded);
    updateEntryMetadata(objectEntry1.id, entryMetadata);

    await flushEntryMetadata(objectEntry1.path);

    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      entryMetadata,
    );
  });

  it('is a no-op when flushing an entry with no pending update', async () => {
    // Should not throw or create any files
    await flushEntryMetadata(objectEntry1.path);

    expect(MockFs.exists(objectSidecarPath)).toBe(false);
  });

  describe('rekeyPendingMetadata', () => {
    it('moves a pending write to the new entry path', async () => {
      const newPath = `${objectDatabase.path}/Renamed Entry.md`;

      // Queue metadata under the original entry path
      updateEntryMetadata(objectEntry1.id, entryMetadata);

      // Re-key from the old path to the new
      rekeyPendingMetadata(objectEntry1.path, newPath);

      await flushEntryMetadata(newPath);

      // The metadata should land in the renamed entry's sidecar
      expect(
        JSON.parse(
          MockFs.readTextFile(
            resolveEntryMetadataFilePath(objectDatabase.path, newPath),
          ),
        ),
      ).toEqual(entryMetadata);
      expect(MockFs.exists(objectSidecarPath)).toBe(false);
    });

    it('is a no-op when the entry has no pending write', () => {
      // Should not throw
      rekeyPendingMetadata(objectEntry1.path, 'new-path');
    });
  });
});
