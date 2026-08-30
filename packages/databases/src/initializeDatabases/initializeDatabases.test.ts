import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  WorkspaceFixtures,
  cleanupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { DatabaseAutomationActionConfigsStore } from '../DatabaseAutomationActionConfigsStore';
import { registerDatabaseBackendAdapter } from '../DatabaseBackendAdapter';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseTemplatesStore } from '../DatabaseTemplatesStore';
import { getAllDatabases } from '../getAllDatabases';
import type { InitializeBackendResult } from '../sql';
import {
  cleanup,
  collectionEntry1,
  databaseEntrySqlRecords,
  databases,
  setup,
} from '../test-utils';
import { virtualCollectionId } from '../utils';
import { initializeDatabases } from './initializeDatabases';

const { workspace_1 } = WorkspaceFixtures;

describe('initializeDatabases', () => {
  // Workspace paths passed to the backend initialization call
  let initializeCalls: string[] = [];
  // Workspace paths passed to the background sync call
  let backgroundSyncCalls: string[] = [];

  beforeEach(() => {
    // Load fixture files only, the stores are hydrated by
    // initializeDatabases itself
    setup({ loadDatabases: false, loadDatabaseEntries: false });

    // Reset the recorded backend calls
    initializeCalls = [];
    backgroundSyncCalls = [];

    // Register a fake backend adapter serving the fixture data
    registerFakeBackendAdapter({
      databases,
      entries: databaseEntrySqlRecords,
      schemaChanged: false,
    });
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

    expect(initializeCalls).toEqual([workspace_1.path]);
  });

  it('triggers a background sync when the schema is unchanged', async () => {
    const result = await initializeDatabases();

    expect(result).toEqual({ schemaChanged: false });
    expect(backgroundSyncCalls).toEqual([workspace_1.path]);
  });

  it('skips the background sync when the schema changed', async () => {
    // The backend already scanned the filesystem for the rebuild
    registerFakeBackendAdapter({
      databases,
      entries: databaseEntrySqlRecords,
      schemaChanged: true,
    });

    const result = await initializeDatabases();

    expect(result).toEqual({ schemaChanged: true });
    expect(backgroundSyncCalls).toEqual([]);
  });

  it('does nothing when there are no workspaces', async () => {
    // Remove the workspace fixtures
    cleanupWorkspaceFixtures();

    const result = await initializeDatabases();

    // No backend call should be made and nothing loaded
    expect(result).toEqual({ schemaChanged: false });
    expect(initializeCalls).toEqual([]);
    expect(getAllDatabases()).toEqual([]);
  });

  /**
   * Registers a fake backend adapter which records its calls and
   * resolves with the given initialization result.
   */
  function registerFakeBackendAdapter(result: InitializeBackendResult): void {
    registerDatabaseBackendAdapter({
      async initializeBackend(workspaceId, workspacePath) {
        // Record the call for assertions
        initializeCalls.push(workspacePath);

        return result;
      },

      async backgroundSync(workspacePath) {
        // Record the call for assertions
        backgroundSyncCalls.push(workspacePath);
      },
    });
  }
});
