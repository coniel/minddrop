import { useEffect, useId, useState } from 'react';
import {
  CollectionCreatedEvent,
  CollectionDeletedEvent,
  CollectionUpdatedEvent,
  CollectionsLoadedEvent,
} from '@minddrop/collections';
import { Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { useQuery } from '../QueriesStore';
import { QueryDeletedEvent, QueryUpdatedEvent } from '../events';
import {
  getQueryCollectionReferences,
  getQueryDatabases,
  getQueryReferencedQueryIds,
} from '../utils';

/**
 * Runs a query-derived computation, re-running it whenever the
 * query changes or the data its graph draws from updates: source
 * database SQL syncs, referenced collection changes, and edits
 * to the queries the graph sources.
 *
 * Returns the empty value when the query does not exist.
 *
 * @param queryId - The ID of the query the computation draws from.
 * @param emptyValue - The value returned while the query does not exist. Must be referentially stable.
 * @param run - Computes the value. Must be memoized; a new identity re-runs the computation.
 *
 * @returns The latest computed value.
 */
export function useQueryRunner<TValue>(
  queryId: string,
  emptyValue: TValue,
  run: () => Promise<TValue>,
): TValue {
  const [value, setValue] = useState<TValue>(emptyValue);

  // Unique listener ID for this hook instance
  const listenerId = useId();

  // The query document, changes re-run the effect so edits
  // produce a fresh value
  const query = useQuery(queryId);

  useEffect(() => {
    // Ignores runs resolving after the effect is cleaned up
    let cancelled = false;

    // Fall back to the empty value when the query does not exist
    if (!query) {
      setValue(emptyValue);

      return;
    }

    // The databases feeding the query's graph, including those
    // of the queries it sources
    const sourceDatabaseIds = getQueryDatabases(query);

    // The queries the graph draws results from
    const referencedQueryIds = getQueryReferencedQueryIds(query);

    // The collections the graph filters by, whose items are
    // compiled into the query
    const collections = getQueryCollectionReferences(query);

    // Whether a collection's contents feed the query
    const referencesCollection = (collectionId: string) =>
      collections.anyCollection ||
      collections.collectionIds.includes(collectionId);

    // Re-computes the value against the latest SQL data
    const rerun = async () => {
      const result = await run();

      // Drop a stale value from a superseded run
      if (!cancelled) {
        setValue(result);
      }
    };

    // Run the computation for the current document state
    rerun();

    // Re-run when a source database's entries sync to SQL
    Events.addListener(
      Databases.events.entriesSqlSynced,
      listenerId,
      (data) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerun();
        }
      },
    );

    // Re-run after background syncs, whose changesets can span
    // databases
    Events.addListener(Databases.events.backgroundSynced, listenerId, rerun);

    // Re-run when a source database's entries are reindexed
    Events.addListener(
      Databases.events.databaseSqlReindexed,
      listenerId,
      (data) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerun();
        }
      },
    );

    // Re-run when a property rename syncs to SQL
    Events.addListener(
      Databases.events.propertySqlSynced,
      listenerId,
      (data) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerun();
        }
      },
    );

    // Re-run when a referenced collection's items change
    Events.addListener(CollectionUpdatedEvent, listenerId, (data) => {
      if (referencesCollection(data.updated.id)) {
        rerun();
      }
    });

    // Re-run when a referenced collection is created, which
    // includes virtual collections hydrated on demand
    Events.addListener(CollectionCreatedEvent, listenerId, (data) => {
      if (referencesCollection(data.id)) {
        rerun();
      }
    });

    // Re-run when a referenced collection is deleted
    Events.addListener(CollectionDeletedEvent, listenerId, (data) => {
      if (referencesCollection(data.id)) {
        rerun();
      }
    });

    // Re-run once collections load, which replaces the store's
    // contents wholesale
    Events.addListener(CollectionsLoadedEvent, listenerId, () => {
      if (collections.anyCollection || collections.collectionIds.length > 0) {
        rerun();
      }
    });

    // Re-run when a query the graph sources is edited, since
    // its results are compiled into this query
    Events.addListener(QueryUpdatedEvent, listenerId, (data) => {
      if (referencedQueryIds.includes(data.updated.id)) {
        rerun();
      }
    });

    // Re-run when a sourced query is deleted
    Events.addListener(QueryDeletedEvent, listenerId, (data) => {
      if (referencedQueryIds.includes(data.id)) {
        rerun();
      }
    });

    return () => {
      cancelled = true;

      // Remove this instance's event listeners
      Events.removeListener(Databases.events.entriesSqlSynced, listenerId);
      Events.removeListener(Databases.events.backgroundSynced, listenerId);
      Events.removeListener(Databases.events.databaseSqlReindexed, listenerId);
      Events.removeListener(Databases.events.propertySqlSynced, listenerId);
      Events.removeListener(CollectionUpdatedEvent, listenerId);
      Events.removeListener(CollectionCreatedEvent, listenerId);
      Events.removeListener(CollectionDeletedEvent, listenerId);
      Events.removeListener(CollectionsLoadedEvent, listenerId);
      Events.removeListener(QueryUpdatedEvent, listenerId);
      Events.removeListener(QueryDeletedEvent, listenerId);
    };
  }, [queryId, query, listenerId, emptyValue, run]);

  return value;
}
