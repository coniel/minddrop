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
  DatabasePropertySqlSyncedEventData,
  DatabaseSqlReindexedEventData,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { useQuery } from '../QueriesStore';
import { runQueryNode } from '../runQueryNode';
import { getQueryCollectionReferences } from '../utils';

/**
 * Returns the IDs of the entries flowing out of a query node,
 * re-running the node whenever the query changes or one of its
 * source databases' SQL data syncs.
 *
 * Returns an empty array when the query or node does not exist
 * or no source flows into the node.
 *
 * @param queryId - The ID of the query containing the node.
 * @param nodeId - The ID of the node whose output to get.
 *
 * @returns The entry IDs flowing out of the node.
 */
export function useQueryNodeResults(queryId: string, nodeId: string): string[] {
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

    // The databases feeding the query's graph
    const sourceDatabaseIds = query.nodes.flatMap((node) =>
      node.type === 'source' && node.database ? [node.database] : [],
    );

    // The collections the graph filters by, whose items are
    // compiled into the query
    const collections = getQueryCollectionReferences(query);

    // Whether a collection's contents feed the query
    const referencesCollection = (collectionId: string) =>
      collections.anyCollection ||
      collections.collectionIds.includes(collectionId);

    // Runs the node against the latest SQL data
    const rerunNode = async () => {
      const entryIds = await runQueryNode(queryId, nodeId);

      // Drop stale results from a superseded run
      if (!cancelled) {
        setResults(entryIds);
      }
    };

    // Run the node for the current document state
    rerunNode();

    // Re-run when a source database's entries sync to SQL
    Events.addListener<DatabaseEntriesSqlSyncedEventData>(
      Databases.events.entriesSqlSynced,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunNode();
        }
      },
    );

    // Re-run after background syncs, whose changesets can span
    // databases
    Events.addListener(
      Databases.events.backgroundSynced,
      listenerId,
      rerunNode,
    );

    // Re-run when a source database's entries are reindexed
    Events.addListener<DatabaseSqlReindexedEventData>(
      Databases.events.databaseSqlReindexed,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunNode();
        }
      },
    );

    // Re-run when a property rename syncs to SQL
    Events.addListener<DatabasePropertySqlSyncedEventData>(
      Databases.events.propertySqlSynced,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunNode();
        }
      },
    );

    // Re-run when a referenced collection's items change
    Events.addListener<CollectionUpdatedEventData>(
      CollectionUpdatedEvent,
      listenerId,
      ({ data }) => {
        if (referencesCollection(data.updated.id)) {
          rerunNode();
        }
      },
    );

    // Re-run when a referenced collection is created, which
    // includes virtual collections hydrated on demand
    Events.addListener<CollectionCreatedEventData>(
      CollectionCreatedEvent,
      listenerId,
      ({ data }) => {
        if (referencesCollection(data.id)) {
          rerunNode();
        }
      },
    );

    // Re-run when a referenced collection is deleted
    Events.addListener<CollectionDeletedEventData>(
      CollectionDeletedEvent,
      listenerId,
      ({ data }) => {
        if (referencesCollection(data.id)) {
          rerunNode();
        }
      },
    );

    // Re-run once collections load, which replaces the store's
    // contents wholesale
    Events.addListener(CollectionsLoadedEvent, listenerId, () => {
      if (collections.anyCollection || collections.collectionIds.length > 0) {
        rerunNode();
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
    };
  }, [queryId, nodeId, query, listenerId]);

  return results;
}
