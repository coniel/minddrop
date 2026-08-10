import { useEffect, useId, useState } from 'react';
import {
  DatabaseEntriesSqlSyncedEventData,
  DatabasePropertySqlSyncedEventData,
  DatabaseSqlReindexedEventData,
  Databases,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { useQuery } from '../QueriesStore';
import { runQuery } from '../runQuery';

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

    // The databases feeding the query's graph
    const sourceDatabaseIds = query.nodes.flatMap((node) =>
      node.type === 'source' && node.database ? [node.database] : [],
    );

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
    Events.addListener<DatabaseEntriesSqlSyncedEventData>(
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
    Events.addListener<DatabaseSqlReindexedEventData>(
      Databases.events.databaseSqlReindexed,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunQuery();
        }
      },
    );

    // Re-run when a property rename syncs to SQL
    Events.addListener<DatabasePropertySqlSyncedEventData>(
      Databases.events.propertySqlSynced,
      listenerId,
      ({ data }) => {
        if (sourceDatabaseIds.includes(data.databaseId)) {
          rerunQuery();
        }
      },
    );

    return () => {
      cancelled = true;

      // Remove this instance's event listeners
      Events.removeListener(Databases.events.entriesSqlSynced, listenerId);
      Events.removeListener(Databases.events.backgroundSynced, listenerId);
      Events.removeListener(Databases.events.databaseSqlReindexed, listenerId);
      Events.removeListener(Databases.events.propertySqlSynced, listenerId);
    };
  }, [queryId, query, listenerId]);

  return results;
}
