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
import { runQuery } from '../runQuery';
import {
  getQueryCollectionReferences,
  getQueryDatabases,
  getQueryReferencedQueryIds,
} from '../utils';

/**
 * Returns the IDs of entries matching a query, re-running the
 * query whenever the query changes or one of its source
 * databases' SQL data syncs.
 *
 * Returns an empty array when the query does not exist or no
 * source is connected to its results node.
 *
 * @param queryId - The ID of the query to run.
 *
 * @returns The matching entry IDs.
 */
export function useQueryResults(queryId: string): string[] {
  const [results, setResults] = useState<string[]>([]);

  // Unique listener ID for this hook instance
  const listenerId = useId();

  // The query document, changes re-run the effect so edits
  // produce fresh results
  const query = useQuery(queryId);

  useEffect(() => {
    // Ignores results resolving after the effect is cleaned up
    let cancelled = false;

    // Clear results when the query does not exist
    if (!query) {
      setResults([]);

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

    // Runs the query against the latest SQL data
    const rerunQuery = async () => {
      const entryIds = await runQuery(queryId);

      // Drop stale results from a superseded run
      if (!cancelled) {
        setResults(entryIds);
      }
    };

    // Run the query for the current document state
    rerunQuery();

    // Re-run when a source database's entries sync to SQL
    Events.addListener(
      Databases.events.entriesSqlSynced,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunQuery();
        }
      },
    );

    // Re-run after background syncs, whose changesets can span
    // databases
    Events.addListener(
      Databases.events.backgroundSynced,
      listenerId,
      rerunQuery,
    );

    // Re-run when a source database's entries are reindexed
    Events.addListener(
      Databases.events.databaseSqlReindexed,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunQuery();
        }
      },
    );

    // Re-run when a property rename syncs to SQL
    Events.addListener(
      Databases.events.propertySqlSynced,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunQuery();
        }
      },
    );

    // Re-run when a referenced collection's items change
    Events.addListener(CollectionUpdatedEvent, listenerId, ({ data }) => {
      if (referencesCollection(data.updated.id)) {
        rerunQuery();
      }
    });

    // Re-run when a referenced collection is created, which
    // includes virtual collections hydrated on demand
    Events.addListener(CollectionCreatedEvent, listenerId, ({ data }) => {
      if (referencesCollection(data.id)) {
        rerunQuery();
      }
    });

    // Re-run when a referenced collection is deleted
    Events.addListener(CollectionDeletedEvent, listenerId, ({ data }) => {
      if (referencesCollection(data.id)) {
        rerunQuery();
      }
    });

    // Re-run once collections load, which replaces the store's
    // contents wholesale
    Events.addListener(CollectionsLoadedEvent, listenerId, () => {
      if (collections.anyCollection || collections.collectionIds.length > 0) {
        rerunQuery();
      }
    });

    // Re-run when a query the graph sources is edited, since
    // its results are compiled into this query
    Events.addListener(QueryUpdatedEvent, listenerId, ({ data }) => {
      if (referencedQueryIds.includes(data.updated.id)) {
        rerunQuery();
      }
    });

    // Re-run when a sourced query is deleted
    Events.addListener(QueryDeletedEvent, listenerId, ({ data }) => {
      if (referencedQueryIds.includes(data.id)) {
        rerunQuery();
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
  }, [queryId, query, listenerId]);

  return results;
}
