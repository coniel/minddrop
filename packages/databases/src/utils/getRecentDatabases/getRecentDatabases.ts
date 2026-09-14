import { DatabasesStore } from '../../DatabasesStore';
import { Database } from '../../types';

/**
 * Returns the most recently created databases, newest first.
 *
 * @param limit - Maximum number of databases to return.
 * @returns The most recently created databases.
 */
export function getRecentDatabases(limit: number): Database[] {
  // Sort a copy by creation date, newest first, and cap the result
  // at the limit.
  return [...DatabasesStore.getAllArray()]
    .sort(
      (databaseA, databaseB) =>
        databaseB.created.getTime() - databaseA.created.getTime(),
    )
    .slice(0, limit);
}
