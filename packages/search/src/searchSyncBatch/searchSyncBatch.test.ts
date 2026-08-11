import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type SearchAdapter, registerSearchAdapter } from '../SearchAdapter';
import {
  clearSearchSyncBatch,
  flushSearchSyncBatch,
  queueDatabaseReindex,
  queueEntryDeletes,
  queueEntryUpserts,
} from './searchSyncBatch';

const workspaceId = 'workspace-1';

// The calls received by the test adapter, in order
let syncCalls: Parameters<SearchAdapter['searchSync']>[0][] = [];
let reindexCalls: Parameters<SearchAdapter['searchReindexDatabase']>[0][] = [];

describe('searchSyncBatch', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    syncCalls = [];
    reindexCalls = [];

    // Register an adapter which records the calls it
    // receives
    registerSearchAdapter({
      searchFullText: async () => [],
      searchInitialize: async () => undefined,
      searchSync: async (params) => {
        syncCalls.push(params);
      },
      searchDatabaseSync: async () => undefined,
      searchReindexDatabase: async (params) => {
        reindexCalls.push(params);
      },
    });
  });

  afterEach(() => {
    clearSearchSyncBatch();

    vi.useRealTimers();
  });

  it('does not sync before the flush delay has elapsed', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);

    vi.advanceTimersByTime(50);

    expect(syncCalls).toEqual([]);
  });

  it('syncs buffered upserts in a single call', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);
    queueEntryUpserts(workspaceId, [
      { id: 'entry-2', title: 'Entry 2', databaseId: 'database-2' },
    ]);

    vi.runAllTimers();

    expect(syncCalls).toEqual([
      {
        workspaceId,
        action: 'upsert',
        entries: [
          { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
          { id: 'entry-2', title: 'Entry 2', databaseId: 'database-2' },
        ],
      },
    ]);
  });

  it('keeps only the latest state of an entry', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Renamed', databaseId: 'database-1' },
    ]);

    vi.runAllTimers();

    expect(syncCalls).toEqual([
      {
        workspaceId,
        action: 'upsert',
        entries: [
          { id: 'entry-1', title: 'Renamed', databaseId: 'database-1' },
        ],
      },
    ]);
  });

  it('syncs buffered deletes in a single call', () => {
    queueEntryDeletes(workspaceId, ['entry-1']);
    queueEntryDeletes(workspaceId, ['entry-2', 'entry-1']);

    vi.runAllTimers();

    expect(syncCalls).toEqual([
      {
        workspaceId,
        action: 'delete',
        entryIds: ['entry-1', 'entry-2'],
      },
    ]);
  });

  it('drops upserts of entries deleted before the flush', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
      { id: 'entry-2', title: 'Entry 2', databaseId: 'database-1' },
    ]);
    queueEntryDeletes(workspaceId, ['entry-1']);

    vi.runAllTimers();

    expect(syncCalls).toEqual([
      {
        workspaceId,
        action: 'delete',
        entryIds: ['entry-1'],
      },
      {
        workspaceId,
        action: 'upsert',
        entries: [
          { id: 'entry-2', title: 'Entry 2', databaseId: 'database-1' },
        ],
      },
    ]);
  });

  it('drops deletes of entries re-created before the flush', () => {
    queueEntryDeletes(workspaceId, ['entry-1']);
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);

    vi.runAllTimers();

    expect(syncCalls).toEqual([
      {
        workspaceId,
        action: 'upsert',
        entries: [
          { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
        ],
      },
    ]);
  });

  it('re-indexes a database only once per flush', () => {
    queueDatabaseReindex(workspaceId, 'database-1');
    queueDatabaseReindex(workspaceId, 'database-1');
    queueDatabaseReindex(workspaceId, 'database-2');

    vi.runAllTimers();

    expect(reindexCalls).toEqual([
      { workspaceId, databaseId: 'database-1' },
      { workspaceId, databaseId: 'database-2' },
    ]);
  });

  it('buffers each workspace separately', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);
    queueEntryUpserts('workspace-2', [
      { id: 'entry-2', title: 'Entry 2', databaseId: 'database-2' },
    ]);

    vi.runAllTimers();

    expect(syncCalls).toEqual([
      {
        workspaceId,
        action: 'upsert',
        entries: [
          { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
        ],
      },
      {
        workspaceId: 'workspace-2',
        action: 'upsert',
        entries: [
          { id: 'entry-2', title: 'Entry 2', databaseId: 'database-2' },
        ],
      },
    ]);
  });

  it('clears the buffer after flushing', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);

    vi.runAllTimers();

    queueEntryUpserts(workspaceId, [
      { id: 'entry-2', title: 'Entry 2', databaseId: 'database-1' },
    ]);

    vi.runAllTimers();

    expect(syncCalls).toHaveLength(2);
    expect(syncCalls[1]).toEqual({
      workspaceId,
      action: 'upsert',
      entries: [{ id: 'entry-2', title: 'Entry 2', databaseId: 'database-1' }],
    });
  });

  it('flushes on demand', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);

    flushSearchSyncBatch();

    expect(syncCalls).toHaveLength(1);

    // The scheduled flush is cancelled, so nothing is sent
    // a second time
    vi.runAllTimers();

    expect(syncCalls).toHaveLength(1);
  });

  it('discards buffered changes when cleared', () => {
    queueEntryUpserts(workspaceId, [
      { id: 'entry-1', title: 'Entry 1', databaseId: 'database-1' },
    ]);

    clearSearchSyncBatch();

    vi.runAllTimers();

    expect(syncCalls).toEqual([]);
  });
});
