import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { getAllDatabases } from '../getAllDatabases';
import {
  MockBackendAdapter,
  cleanup,
  collectionEntry1,
  createMockBackendAdapter,
  databaseEntrySqlRecords,
  databases,
  setup,
} from '../test-utils';
import { virtualCollectionId } from '../utils';
import { initializeDatabases } from './initializeDatabases';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeDatabases', () => {
  // The registered mock backend's recorded call state
  let backend: MockBackendAdapter;

  beforeEach(() => {
    // Load fixture files only, the stores are hydrated by
    // initializeDatabases itself
    setup({ loadDatabases: false, loadDatabaseEntries: false });

    // Register a fake backend adapter serving the fixture data
    backend = createMockBackendAdapter();
  });

  afterEach(() => {
    // Clear the stores loaded by initializeDatabases
    DatabaseTemplatesStore.clear();
    DatabaseAutomationActionConfigsStore.clear();

    cleanup();
  });

  it('loads the databases into the store', async () => {
    await initializeDatabases();

    // All backend databases should be loaded
    expect(
      getAllDatabases()
        .map((database) => database.id)
        .sort(),
    ).toEqual(databases.map((database) => database.id).sort());
  });

  it('loads the entries into the store', async () => {
    await initializeDatabases();

    // All backend entries should be loaded, converted from SQL records
    const entries = DatabaseEntriesStore.getAllArray();

    expect(entries.length).toBe(databaseEntrySqlRecords.length);
    expect(
      entries.find((entry) => entry.id === collectionEntry1.id),
    ).toMatchObject({
      id: collectionEntry1.id,
      path: collectionEntry1.path,
      title: collectionEntry1.title,
    });
  });

  it('hydrates virtual collections from collection properties', async () => {
    await initializeDatabases();

    // A virtual collection should exist for the entry's collection property
    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );

    expect(collection.virtual).toBe(true);
  });

  it('passes the workspace to the backend initialization', async () => {
    await initializeDatabases();

    expect(backend.initializeBackendCalls).toEqual([
      { workspaceId: workspace_1.id, workspacePath: workspace_1.path },
    ]);
  });

  it('triggers a background sync when the schema is unchanged', async () => {
    const result = await initializeDatabases();

    expect(result).toEqual({ schemaChanged: false });
    expect(backend.backgroundSyncCalls).toEqual([workspace_1.path]);
  });

  it('skips the background sync when the schema changed', async () => {
    // The backend already scanned the filesystem for the rebuild
    backend = createMockBackendAdapter({ schemaChanged: true });

    const result = await initializeDatabases();

    expect(result).toEqual({ schemaChanged: true });
    expect(backend.backgroundSyncCalls).toEqual([]);
  });

  it('does nothing when there are no workspaces', async () => {
    // Remove the workspace fixtures
    cleanupWorkspaceFixtures();

    const result = await initializeDatabases();

    // No backend call should be made and nothing loaded
    expect(result).toEqual({ schemaChanged: false });
    expect(backend.initializeBackendCalls).toEqual([]);
    expect(getAllDatabases()).toEqual([]);
  });
});
