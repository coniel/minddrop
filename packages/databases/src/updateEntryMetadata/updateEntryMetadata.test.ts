import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { EntryNotFoundError } from '../errors';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  entryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
  urlDatabase,
  urlEntry1,
} from '../test-utils';
import { EntryMetadata } from '../types';
import {
  resolveDatabasePath,
  resolveEntryMetadataFilePath,
  resolveEntryPath,
} from '../utils';
import { updateEntryMetadata } from './updateEntryMetadata';

// The sidecar paths the entries' metadata is written to
const objectSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(objectDatabase),
  entryFilePath(objectEntry1),
);
const urlSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(urlDatabase),
  entryFilePath(urlEntry1),
);

const entryMetadata: EntryMetadata = {
  color: 'red',
};

const { workspace_2 } = WorkspaceFixtures;

describe('updateEntryMetadata', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the metadata on the stored entry', async () => {
    await updateEntryMetadata(objectEntry1.id, entryMetadata);

    // The store entry should reflect the updated metadata
    expect(storeItem(EntriesStore, objectEntry1.id).metadata).toEqual(
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
    // Write a sidecar holding superseded metadata, with a field the
    // update lacks.
    MockFs.addFiles([
      {
        path: objectSidecarPath,
        textContent: JSON.stringify({
          color: 'blue',
          lastModified: '2024-01-01T00:00:00.000Z',
        }),
      },
    ]);

    await updateEntryMetadata(objectEntry1.id, entryMetadata);

    expect(JSON.parse(MockFs.readTextFile(objectSidecarPath))).toEqual(
      entryMetadata,
    );
  });

  it('keeps each entry to its own sidecar', async () => {
    const metadata1: EntryMetadata = {
      color: 'blue',
    };
    const metadata2: EntryMetadata = {
      color: 'green',
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
    const superseded: EntryMetadata = {
      color: 'blue',
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
    ).rejects.toThrowError(EntryNotFoundError);
  });

  it("updates the given workspace's entry and writes its sidecar", async () => {
    // The entry and its database held by the second workspace as well
    DatabasesStore.in(workspace_2.id).set(objectDatabase);
    EntriesStore.in(workspace_2.id).set(objectEntry1);

    await updateEntryMetadata(objectEntry1.id, entryMetadata, workspace_2.id);

    // The second workspace's entry and sidecar hold the metadata, the
    // active workspace's are untouched.
    expect(
      EntriesStore.in(workspace_2.id).get(objectEntry1.id)?.metadata,
    ).toEqual(entryMetadata);
    expect(
      JSON.parse(
        MockFs.readTextFile(
          resolveEntryMetadataFilePath(
            resolveDatabasePath(objectDatabase, workspace_2.path),
            resolveEntryPath(objectEntry1, objectDatabase, workspace_2.path),
          ),
        ),
      ),
    ).toEqual(entryMetadata);
    expect(storeItem(EntriesStore, objectEntry1.id).metadata).toEqual({});
    expect(MockFs.exists(objectSidecarPath)).toBe(false);
  });
});
