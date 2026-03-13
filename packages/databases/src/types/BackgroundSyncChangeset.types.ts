import type { Database } from './Database.types';
import type { SqlEntryRecord } from './SqlEntryRecord.types';

export interface BackgroundSyncChangeset {
  /**
   * Whether any changes were detected.
   */
  hasChanges: boolean;

  /**
   * Database configs that were added or changed on disk
   * since the last sync.
   */
  upsertedDatabases: Database[];

  /**
   * IDs of databases that were removed from disk since
   * the last sync.
   */
  deletedDatabaseIds: string[];

  /**
   * Entries that were added or modified on disk since
   * the last sync, as SQL records.
   */
  upsertedEntries: SqlEntryRecord[];

  /**
   * IDs of entries that were removed from disk since
   * the last sync.
   */
  deletedEntryIds: string[];
}
