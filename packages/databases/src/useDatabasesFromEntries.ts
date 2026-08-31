import { useMemo } from 'react';
import { useDatabases } from './DatabasesStore';
import { getDatabasesFromEntries } from './getDatabasesFromEntries';
import { Database } from './types';

/**
 * Retrieves a unique list of the databases the given entries
 * belong to.
 *
 * @param entryIds - The IDs of the entries to look up.
 * @returns A unique list of databases.
 */
export function useDatabasesFromEntries(entryIds: string[]): Database[] {
  // Subscribes to the databases, whose configs the lookup returns
  const databases = useDatabases();

  return useMemo(
    () => getDatabasesFromEntries(entryIds),
    // The subscribed databases are a dependency because the
    // lookup reads them from the store
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entryIds, databases],
  );
}
