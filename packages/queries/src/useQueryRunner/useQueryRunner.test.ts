import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CollectionCreatedEvent,
  CollectionDeletedEvent,
  CollectionUpdatedEvent,
  CollectionsLoadedEvent,
} from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  act,
  cleanup as cleanupRender,
  renderHook,
} from '@minddrop/test-utils';
import { QueriesStore } from '../QueriesStore';
import { QueryDeletedEvent, QueryUpdatedEvent } from '../events';
import { QueryFixtures, cleanup, setup } from '../test-utils';
import { Query } from '../types';
import { useQueryRunner } from './useQueryRunner';

const { query_1, query_2 } = QueryFixtures;
const { collection_1, collection_2 } = CollectionFixtures;

// The database sourced by the query fixtures
const SOURCE_DATABASE_ID = 'database_objects';

// A query filtering by membership of collection_1
const collectionQuery: Query = {
  ...query_1,
  id: 'query_collection',
  nodes: [
    ...query_1.nodes,
    {
      id: 'query-node_collection-filter',
      type: 'collection-filter',
      x: 0,
      y: 300,
      source: 'collection',
      collection: collection_1.id,
      operator: 'is-in',
    },
  ],
};

// A query drawing its entries from query_2
const referencingQuery: Query = {
  ...query_1,
  id: 'query_referencing',
  nodes: [
    {
      id: 'query-node_source-referencing',
      type: 'source',
      x: 0,
      y: 0,
      sources: [{ type: 'query', id: query_2.id }],
    },
  ],
};

// Stable empty value for the runs
const EMPTY_VALUE: string[] = [];

describe('useQueryRunner', () => {
  // Number of times the test runner has been called
  let runCount: number;

  // Test runner returning a value unique to each run
  const run = async (): Promise<string[]> => {
    runCount += 1;

    return [`run-${runCount}`];
  };

  beforeEach(() => {
    setup({ loadQueryFiles: false });

    // Load the custom query variants used by the tests
    QueriesStore.load([collectionQuery, referencingQuery]);

    // Reset the run counter
    runCount = 0;
  });

  afterEach(() => {
    // Unmount rendered hooks so their listeners are removed
    cleanupRender();

    cleanup();
  });

  /**
   * Renders the hook for a query and flushes the initial run.
   *
   * @param queryId - The ID of the query to run against.
   * @returns The render result.
   */
  async function renderRunner(queryId: string) {
    const hook = renderHook(() => useQueryRunner(queryId, EMPTY_VALUE, run));

    // Flush the initial run's state update
    await act(async () => {});

    return hook;
  }

  /**
   * Dispatches an event and flushes the resulting re-run.
   *
   * @param event - The event name to dispatch.
   * @param data - The event data.
   */
  async function dispatch(event: string, data?: unknown) {
    await act(async () => {
      await Events.dispatch(event, data);
    });
  }

  it('runs the computation for the current query state', async () => {
    // Render the hook for an existing query
    const { result } = await renderRunner(query_1.id);

    // Should return the initial run's value
    expect(result.current).toEqual(['run-1']);
  });

  it('returns the empty value when the query does not exist', async () => {
    // Render the hook for a missing query
    const { result } = await renderRunner('query_missing');

    // Should return the empty value without running
    expect(result.current).toBe(EMPTY_VALUE);
    expect(runCount).toBe(0);
  });

  it('re-runs when a source database syncs entries to SQL', async () => {
    // Render the hook for a query sourcing the database
    const { result } = await renderRunner(query_1.id);

    // Sync entries of the source database
    await dispatch(Databases.events.entriesSqlSynced, {
      action: 'upsert',
      entryIds: [],
      databaseId: SOURCE_DATABASE_ID,
    });

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);
  });

  it('ignores entry syncs of unrelated databases', async () => {
    // Render the hook for a query sourcing the database
    const { result } = await renderRunner(query_1.id);

    // Sync entries of an unrelated database
    await dispatch(Databases.events.entriesSqlSynced, {
      action: 'upsert',
      entryIds: [],
      databaseId: 'database_other',
    });

    // Should not have re-run the computation
    expect(result.current).toEqual(['run-1']);
  });

  it('re-runs after a background sync', async () => {
    // Render the hook for an existing query
    const { result } = await renderRunner(query_1.id);

    // Apply a background sync changeset
    await dispatch(Databases.events.backgroundSynced, {
      upsertedDatabases: [],
      deletedDatabaseIds: [],
      upsertedEntries: [],
      deletedEntryIds: [],
    });

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);
  });

  it('re-runs when a source database is reindexed', async () => {
    // Render the hook for a query sourcing the database
    const { result } = await renderRunner(query_1.id);

    // Reindex the source database
    await dispatch(Databases.events.databaseSqlReindexed, {
      databaseId: SOURCE_DATABASE_ID,
    });

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);
  });

  it('re-runs when a source database property rename syncs to SQL', async () => {
    // Render the hook for a query sourcing the database
    const { result } = await renderRunner(query_1.id);

    // Sync a property rename of the source database
    await dispatch(Databases.events.propertySqlSynced, {
      action: 'rename',
      databaseId: SOURCE_DATABASE_ID,
      oldName: 'Old',
      newName: 'New',
    });

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);
  });

  it('re-runs when a referenced collection changes', async () => {
    // Render the hook for a query filtering by collection_1
    const { result } = await renderRunner(collectionQuery.id);

    // Update the referenced collection
    await dispatch(CollectionUpdatedEvent, {
      original: collection_1,
      updated: collection_1,
    });

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);

    // Create and delete the referenced collection
    await dispatch(CollectionCreatedEvent, collection_1);
    await dispatch(CollectionDeletedEvent, collection_1);

    // Should have re-run for each event
    expect(result.current).toEqual(['run-4']);
  });

  it('ignores changes to unreferenced collections', async () => {
    // Render the hook for a query filtering by collection_1
    const { result } = await renderRunner(collectionQuery.id);

    // Update an unreferenced collection
    await dispatch(CollectionUpdatedEvent, {
      original: collection_2,
      updated: collection_2,
    });

    // Should not have re-run the computation
    expect(result.current).toEqual(['run-1']);
  });

  it('re-runs once collections load', async () => {
    // Render the hook for a query filtering by collection_1
    const { result } = await renderRunner(collectionQuery.id);

    // Load the collections store
    await dispatch(CollectionsLoadedEvent, [collection_1]);

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);
  });

  it('re-runs when a sourced query changes', async () => {
    // Render the hook for a query drawing from query_2
    const { result } = await renderRunner(referencingQuery.id);

    // Update the sourced query
    await dispatch(QueryUpdatedEvent, {
      original: query_2,
      updated: query_2,
    });

    // Should have re-run the computation
    expect(result.current).toEqual(['run-2']);

    // Delete the sourced query
    await dispatch(QueryDeletedEvent, query_2);

    // Should have re-run the computation again
    expect(result.current).toEqual(['run-3']);
  });

  it('ignores changes to unrelated queries', async () => {
    // Render the hook for a query drawing from query_2
    const { result } = await renderRunner(referencingQuery.id);

    // Update a query the graph does not source
    await dispatch(QueryUpdatedEvent, {
      original: query_1,
      updated: query_1,
    });

    // Should not have re-run the computation
    expect(result.current).toEqual(['run-1']);
  });

  it('stops re-running after unmount', async () => {
    // Render and unmount the hook
    const { unmount } = await renderRunner(query_1.id);
    unmount();

    // Sync entries of the source database
    await dispatch(Databases.events.entriesSqlSynced, {
      action: 'upsert',
      entryIds: [],
      databaseId: SOURCE_DATABASE_ID,
    });

    // Should not have run again after the initial run
    expect(runCount).toBe(1);
  });
});
