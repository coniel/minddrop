import type { SqlEntryRecord } from './types';

// Entries synced event - fired after SQL entry changes
export const DatabaseEntriesSqlSyncedEvent = 'database-entries:sql-synced';

export interface DatabaseEntriesSqlSyncedEventData {
  /**
   * Whether entries were upserted or deleted.
   */
  action: 'upsert' | 'delete';

  /**
   * The IDs of the affected entries.
   */
  entryIds: string[];

  /**
   * The database ID the entries belong to.
   */
  databaseId: string;

  /**
   * The full entry records (only present for upsert actions).
   */
  entries?: SqlEntryRecord[];
}

// Database synced event - fired after SQL database metadata changes
export const DatabaseSqlSyncedEvent = 'databases:database:sql-synced';

export interface DatabaseSqlSyncedEventData {
  /**
   * Whether the database was upserted or deleted.
   */
  action: 'upsert' | 'delete';

  /**
   * The ID of the affected database.
   */
  databaseId: string;

  /**
   * The database metadata (only present for upsert actions).
   */
  database?: { id: string; name: string; path: string; icon: string };
}

// Property synced event - fired after a SQL property rename
export const DatabasePropertySqlSyncedEvent = 'databases:property:sql-synced';

export interface DatabasePropertySqlSyncedEventData {
  /**
   * The type of property change.
   */
  action: 'rename';

  /**
   * The database ID the property belongs to.
   */
  databaseId: string;

  /**
   * The original property name.
   */
  oldName: string;

  /**
   * The new property name.
   */
  newName: string;
}

// Database reindexed event - fired after a full re-index
export const DatabaseSqlReindexedEvent = 'databases:database:sql-reindexed';

export interface DatabaseSqlReindexedEventData {
  /**
   * The ID of the database that was reindexed.
   */
  databaseId: string;
}
