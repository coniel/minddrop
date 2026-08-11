import { useEffect, useId, useState } from 'react';
import {
  CollectionCreatedEvent,
  CollectionCreatedEventData,
  CollectionDeletedEvent,
  CollectionDeletedEventData,
  CollectionUpdatedEvent,
  CollectionUpdatedEventData,
  CollectionsLoadedEvent,
} from '@minddrop/collections';
import {
  DatabaseEntriesSqlSyncedEventData,
  DatabaseSqlReindexedEventData,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { useQuery } from '../QueriesStore';
import {
  QueryDeletedEvent,
  QueryDeletedEventData,
  QueryUpdatedEvent,
  QueryUpdatedEventData,
} from '../events';
import { QueryNodeCounts, getQueryNodeCounts } from '../getQueryNodeCounts';
import {
  getQueryCollectionReferences,
  getQueryDatabases,
  getQueryReferencedQueryIds,
} from '../utils';

/**
 * Returns the entry counts flowing into and out of each node of
 * a query's graph, re-counting whenever the query changes or
 * one of its source databases' SQL data syncs.
 *
 * Returns an empty record when the query does not exist.
 *
 * @param queryId - The ID of the query whose node counts to get.
 *
 * @returns The input/output counts keyed by node ID.
 */
export function useQueryNodeCounts(
  queryId: string,
): Record<string, QueryNodeCounts> {
  const [counts, setCounts] = useState<Record<string, QueryNodeCounts>>({});

  // Unique listener ID for this hook instance
  const listenerId = useId();

  // The query document, changes re-run the effect so edits
  // produce fresh counts
  const query = useQuery(queryId);

  useEffect(() => {
    // Ignores counts resolving after the effect is cleaned up
    let cancelled = false;

    // Clear counts when the query does not exist
    if (!query) {
      setCounts({});

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

    // Recounts the node flows against the latest SQL data
    const recount = async () => {
      const nodeCounts = await getQueryNodeCounts(queryId);

      // Drop stale counts from a superseded run
      if (!cancelled) {
        setCounts(nodeCounts);
      }
    };

    // Count the flows for the current document state
    recount();

    // Re-count when a source database's entries sync to SQL
    Events.addListener<DatabaseEntriesSqlSyncedEventData>(
      Databases.events.entriesSqlSynced,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          recount();
        }
      },
    );

    // Re-count after background syncs, whose changesets can
    // span databases
    Events.addListener(Databases.events.backgroundSynced, listenerId, recount);

    // Re-count when a source database's entries are reindexed
    Events.addListener<DatabaseSqlReindexedEventData>(
      Databases.events.databaseSqlReindexed,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          recount();
        }
      },
    );

    // Re-count when a referenced collection's items change
    Events.addListener<CollectionUpdatedEventData>(
      CollectionUpdatedEvent,
      listenerId,
      ({ data }) => {
        if (referencesCollection(data.updated.id)) {
          recount();
        }
      },
    );

    // Re-count when a referenced collection is created, which
    // includes virtual collections hydrated on demand
    Events.addListener<CollectionCreatedEventData>(
      CollectionCreatedEvent,
      listenerId,
      ({ data }) => {
        if (referencesCollection(data.id)) {
          recount();
        }
      },
    );

    // Re-count when a referenced collection is deleted
    Events.addListener<CollectionDeletedEventData>(
      CollectionDeletedEvent,
      listenerId,
      ({ data }) => {
        if (referencesCollection(data.id)) {
          recount();
        }
      },
    );

    // Re-count once collections load, which replaces the store's
    // contents wholesale
    Events.addListener(CollectionsLoadedEvent, listenerId, () => {
      if (collections.anyCollection || collections.collectionIds.length > 0) {
        recount();
      }
    });

    // Re-count when a query the graph sources is edited, since
    // its results are compiled into this query
    Events.addListener<QueryUpdatedEventData>(
      QueryUpdatedEvent,
      listenerId,
      ({ data }) => {
        if (referencedQueryIds.includes(data.updated.id)) {
          recount();
        }
      },
    );

    // Re-count when a sourced query is deleted
    Events.addListener<QueryDeletedEventData>(
      QueryDeletedEvent,
      listenerId,
      ({ data }) => {
        if (referencedQueryIds.includes(data.id)) {
          recount();
        }
      },
    );

    return () => {
      cancelled = true;

      // Remove this instance's event listeners
      Events.removeListener(Databases.events.entriesSqlSynced, listenerId);
      Events.removeListener(Databases.events.backgroundSynced, listenerId);
      Events.removeListener(Databases.events.databaseSqlReindexed, listenerId);
      Events.removeListener(CollectionUpdatedEvent, listenerId);
      Events.removeListener(CollectionCreatedEvent, listenerId);
      Events.removeListener(CollectionDeletedEvent, listenerId);
      Events.removeListener(CollectionsLoadedEvent, listenerId);
      Events.removeListener(QueryUpdatedEvent, listenerId);
      Events.removeListener(QueryDeletedEvent, listenerId);
    };
  }, [queryId, query, listenerId]);

  return counts;
}
