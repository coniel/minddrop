import { useEffect, useId, useState } from 'react';
import {
  DatabaseEntriesSqlSyncedEventData,
  DatabaseSqlReindexedEventData,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { useQuery } from '../QueriesStore';
import { QueryNodeCounts, getQueryNodeCounts } from '../getQueryNodeCounts';

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

    // The databases feeding the query's graph
    const sourceDatabaseIds = query.nodes.flatMap((node) =>
      node.type === 'source' && node.database ? [node.database] : [],
    );

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

    return () => {
      cancelled = true;

      // Remove this instance's event listeners
      Events.removeListener(Databases.events.entriesSqlSynced, listenerId);
      Events.removeListener(Databases.events.backgroundSynced, listenerId);
      Events.removeListener(Databases.events.databaseSqlReindexed, listenerId);
    };
  }, [queryId, query, listenerId]);

  return counts;
}
