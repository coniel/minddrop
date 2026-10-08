import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { onFileSystemChanged } from '../event-handlers';
import { getAllDatabases } from '../getAllDatabases';
import {
  MockBackendAdapter,
  cleanup,
  collectionEntry1,
  createMockBackendAdapter,
  databases,
  entryFilePath,
  entrySqlRecords,
  flushFileSystemChangeDebounces,
  objectEntry1,
  setup,
} from '../test-utils';
import { virtualCollectionId } from '../utils';
import { loadWorkspaceDatabases } from './loadWorkspaceDatabases';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadWorkspaceDatabases', () => {
  // The registered mock backend's recorded call state
  let backend: MockBackendAdapter;

  beforeEach(() => {
    // Load fixture files only, the stores are hydrated by
    // loadWorkspaceDatabases itself.
    setup({ loadDatabases: false, loadEntries: false });

    // Register a fake backend adapter serving the fixture data
    backend = createMockBackendAdapter();
  });

  afterEach(cleanup);

  it('loads the databases into the store', async () => {
    await loadWorkspaceDatabases(workspace_1);

    // All backend databases should be loaded
    expect(
      getAllDatabases()
        .map((database) => database.id)
        .sort(),
    ).toEqual(databases.map((database) => database.id).sort());
  });

  it('loads the entries into the store', async () => {
    await loadWorkspaceDatabases(workspace_1);

    // All backend entries should be loaded, converted from SQL records
    const entries = EntriesStore.getAllArray();

    expect(entries.length).toBe(entrySqlRecords.length);
    expect(
      entries.find((entry) => entry.id === collectionEntry1.id),
    ).toMatchObject({
      id: collectionEntry1.id,
      path: collectionEntry1.path,
      title: collectionEntry1.title,
    });
  });

  it("loads into the workspace's store records", async () => {
    await loadWorkspaceDatabases(workspace_2);

    // Should load into the second workspace's records, not the
    // active workspace's.
    expect(DatabasesStore.in(workspace_2.id).getAllArray().length).toBe(
      databases.length,
    );
    expect(EntriesStore.in(workspace_2.id).getAllArray().length).toBe(
      entrySqlRecords.length,
    );
    expect(DatabasesStore).toHaveItemCount(0);
    expect(EntriesStore).toHaveItemCount(0);
  });

  it('hydrates virtual collections from collection properties', async () => {
    await loadWorkspaceDatabases(workspace_1);

    // A virtual collection should exist for the entry's collection property
    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );

    expect(collection.virtual).toBe(true);
  });

  it('passes the workspace to the backend initialization', async () => {
    await loadWorkspaceDatabases(workspace_1);

    expect(backend.initializeBackendCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('triggers a background sync when the schema is unchanged', async () => {
    const result = await loadWorkspaceDatabases(workspace_1);

    expect(result).toEqual({ schemaChanged: false });
    expect(backend.backgroundSyncCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('skips the background sync when the schema changed', async () => {
    // The backend already scanned the filesystem for the rebuild
    backend = createMockBackendAdapter({ result: { schemaChanged: true } });

    const result = await loadWorkspaceDatabases(workspace_1);

    expect(result).toEqual({ schemaChanged: true });
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('leaves the background sync running once the databases are loaded', async () => {
    backend = await startDeferredBackgroundSync();

    // Finishing a sync throws if none is unfinished
    expect(() => backend.finishNextSync()).not.toThrow();
  });

  // Pins Issue 52: Startup background sync bypasses the per-workspace sync
  // lock. Remove .fails once fixed.
  it.fails(
    'holds back a watcher sync until the background sync finishes',
    async () => {
      backend = await startDeferredBackgroundSync();

      // Report an entry file changed by a sync client while the background
      // sync runs.
      await onFileSystemChanged({
        workspaceId: workspace_1.id,
        path: entryFilePath(objectEntry1),
        kind: 'modified',
      });
      await flushFileSystemChangeDebounces();

      try {
        // Expect no entry sync alongside the background sync. Interleaved
        // syncs mint two IDs for a file new to both.
        expect(backend.syncEntryFilesCalls).toEqual([]);
      } finally {
        // Finish the background sync and any sync queued behind it
        await backend.finishAllSyncs();
      }
    },
  );

  it('has the backend fill the content index after a rebuild', async () => {
    backend = createMockBackendAdapter({ result: { schemaChanged: true } });

    await loadWorkspaceDatabases(workspace_1);

    expect(backend.fillEntryContentIndexCalls).toEqual([
      { workspaceId: workspace_1.id },
    ]);
  });

  it('has the backend fill the content index on a normal launch', async () => {
    // Load the workspace without a rebuild
    await loadWorkspaceDatabases(workspace_1);

    expect(backend.fillEntryContentIndexCalls).toEqual([
      { workspaceId: workspace_1.id },
    ]);
  });
});

/**
 * Loads the workspace's databases onto a backend whose syncs finish when
 * told to, starting the background sync.
 *
 * @returns The registered mock backend's recorded call state.
 */
async function startDeferredBackgroundSync(): Promise<MockBackendAdapter> {
  // Stand in for a backend whose syncs finish when told to
  const backend = createMockBackendAdapter({ deferSyncs: true });

  // Load the workspace's databases, starting the background sync
  await loadWorkspaceDatabases(workspace_1);

  return backend;
}
