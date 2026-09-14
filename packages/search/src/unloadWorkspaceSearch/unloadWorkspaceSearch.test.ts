import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchAdapter, registerSearchAdapter } from '../SearchAdapter';
import {
  clearSearchSyncBatch,
  flushSearchSyncBatch,
  queueEntryUpserts,
} from '../searchSyncBatch';
import { unloadWorkspaceSearch } from './unloadWorkspaceSearch';

const workspaceId = 'workspace_1';

// The unload and sync calls the adapter received
let unloadCalls: Parameters<SearchAdapter['searchUnload']>[0][] = [];
let syncCalls: Parameters<SearchAdapter['searchSync']>[0][] = [];

describe('unloadWorkspaceSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    unloadCalls = [];
    syncCalls = [];

    // Register an adapter which records the calls it receives
    registerSearchAdapter({
      searchFullText: async () => [],
      searchInitialize: async () => undefined,
      searchUnload: async (params) => {
        unloadCalls.push(params);
      },
      searchSync: async (params) => {
        syncCalls.push(params);
      },
      searchDatabaseSync: async () => undefined,
      searchReindexDatabase: async () => undefined,
    });
  });

  afterEach(() => {
    clearSearchSyncBatch();
    vi.useRealTimers();
  });

  it('has the backend drop the workspace index', async () => {
    await unloadWorkspaceSearch(workspaceId);

    expect(unloadCalls).toEqual([{ workspaceId }]);
  });

  it('drops the changes buffered for the workspace', async () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);
    queueEntryUpserts('workspace_2', [
      { id: 'entry-2', title: 'Entry 2', databaseId: 'database-2' },
    ]);

    await unloadWorkspaceSearch(workspaceId);
    flushSearchSyncBatch();

    // Only the other workspace's changes are synced
    expect(syncCalls.map((call) => call.workspaceId)).toEqual(['workspace_2']);
  });
});
