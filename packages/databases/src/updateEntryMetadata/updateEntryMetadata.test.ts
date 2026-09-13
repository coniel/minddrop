import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntryNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  databaseEntryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
  urlDatabase,
  urlEntry1,
} from '../test-utils';
import { DatabaseEntryMetadata } from '../types';
import {
  resolveDatabaseEntryPath,
  resolveDatabasePath,
  resolveEntryMetadataFilePath,
} from '../utils';
import { updateEntryMetadata } from './updateEntryMetadata';

// The sidecar paths the entries' metadata is written to
const objectSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(objectDatabase),
  databaseEntryFilePath(objectEntry1),
);
const urlSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(urlDatabase),
  databaseEntryFilePath(urlEntry1),
);

const entryMetadata: DatabaseEntryMetadata = {
  embeddedViewConfigs: {
    'card:Tasks': {
      options: { columns: [['a', 'b'], ['c']] },
      data: {},
    },
  },
};

const { workspace_2 } = WorkspaceFixtures;

describe('updateEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the metadata on the stored entry', async () => {
    await updateEntryMetadata(objectEntry1.id, entryMetadata);

    // The store entry should reflect the updated metadata
    expect(storeItem(DatabaseEntriesStore, objectEntry1.id).metadata).toEqual(
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

  it("updates the given workspace's entry and writes its sidecar", async () => {
    // The entry and its database held by the second workspace as well
    DatabasesStore.in(workspace_2.id).set(objectDatabase);
    DatabaseEntriesStore.in(workspace_2.id).set(objectEntry1);

    await updateEntryMetadata(objectEntry1.id, entryMetadata, workspace_2.id);

    // The second workspace's entry and sidecar hold the metadata, the
    // active workspace's are untouched.
    expect(
      DatabaseEntriesStore.in(workspace_2.id).get(objectEntry1.id)?.metadata,
    ).toEqual(entryMetadata);
    expect(
      JSON.parse(
        MockFs.readTextFile(
          resolveEntryMetadataFilePath(
            resolveDatabasePath(objectDatabase, workspace_2.path),
            resolveDatabaseEntryPath(
              objectEntry1,
              objectDatabase,
              workspace_2.path,
            ),
          ),
        ),
      ),
    ).toEqual(entryMetadata);
    expect(storeItem(DatabaseEntriesStore, objectEntry1.id).metadata).toEqual(
      {},
    );
    expect(MockFs.exists(objectSidecarPath)).toBe(false);
  });
});
