import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryNotFoundError } from '../errors';
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
import { updateEntryMetadata } from './updateEntryMetadata';

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

  it('sets the metadata on the stored entry', async () => {
    await updateEntryMetadata(objectEntry1.id, entryMetadata);

    // The store entry should reflect the updated metadata
    expect(DatabaseEntriesStore.get(objectEntry1.id)?.metadata).toEqual(
      entryMetadata,
    );
  });

  it('creates the sidecar if it does not exist', async () => {
    await updateEntryMetadata(objectEntry1.id, entryMetadata);

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

    await updateEntryMetadata(objectEntry1.id, entryMetadata);

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

    // Update entries in different databases
    await updateEntryMetadata(objectEntry1.id, metadata1);
    await updateEntryMetadata(urlEntry1.id, metadata2);

    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      metadata1,
    );
    expect(JSON.parse(MockFs.readTextFile(urlSidecarPath))).toEqual(metadata2);
  });

  it('keeps only the last of successive updates to one entry', async () => {
    const superseded: DatabaseEntryMetadata = {
      embeddedViewConfigs: { 'card:Tags': { options: {}, data: {} } },
    };

    await updateEntryMetadata(objectEntry1.id, superseded);
    await updateEntryMetadata(objectEntry1.id, entryMetadata);

    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      entryMetadata,
    );
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      updateEntryMetadata('missing-entry', entryMetadata),
    ).rejects.toThrowError(DatabaseEntryNotFoundError);
  });
});
