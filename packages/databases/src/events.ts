import { PropertySchema } from '@minddrop/properties';
import {
  Database,
  DatabaseEntry,
  DatabaseEntryMetadata,
  DatabaseEntryOpenMode,
  SqlEntryRecord,
} from './types';

// Database events
export const DatabaseCreatedEvent = 'databases:database:created';
export const DatabaseUpdatedEvent = 'databases:database:updated';
export const DatabaseDeletedEvent = 'databases:database:deleted';
export const DatabaseRenamedEvent = 'databases:database:renamed';

export type DatabaseCreatedEventData = Database;
export interface DatabaseUpdatedEventData {
  original: Database;
  updated: Database;
}
export type DatabaseDeletedEventData = Database;
export interface DatabaseRenamedEventData {
  original: Database;
  updated: Database;
}

// Property events
export const DatabasePropertyAddedEvent = 'databases:property:added';
export const DatabasePropertyRemovedEvent = 'databases:property:removed';
export const DatabasePropertyRenamedEvent = 'databases:property:renamed';

export interface DatabasePropertyAddedEventData {
  /**
   * The database the property was added to.
   */
  database: Database;

  /**
   * The property that was added.
   */
  property: PropertySchema;
}

export interface DatabasePropertyRemovedEventData {
  /**
   * The database the property was removed from.
   */
  database: Database;

  /**
   * The property that was removed.
   */
  property: PropertySchema;
}

export interface DatabasePropertyRenamedEventData {
  /**
   * The database the property belongs to.
   */
  database: Database;

  /**
   * The original property name.
   */
  oldName: string;

  /**
   * The new property name.
   */
  newName: string;
}

// Navigation events
export const OpenDatabaseViewEvent = 'databases:view:open';

export interface OpenDatabaseViewEventData {
  /**
   * The ID of the database to open.
   */
  databaseId: string;

  /**
   * Whether to open the configuration panel.
   */
  configurationPanelOpen?: boolean;
}

export const OpenDatabaseEntryViewEvent = 'database-entries:entry:open';

export interface OpenDatabaseEntryViewEventData {
  /**
   * The ID of the database entry to open.
   */
  entryId: string;

  /**
   * How to open the entry. If not provided, falls back to the
   * database's `entryOpenMode` setting.
   */
  openMode?: DatabaseEntryOpenMode;
}

// Entry events
export const DatabaseEntryCreatedEvent = 'databases:entry:created';
export const DatabaseEntryUpdatedEvent = 'databases:entry:updated';
export const DatabaseEntryDeletedEvent = 'databases:entry:deleted';
export const DatabaseEntryRenamedEvent = 'databases:entry:renamed';

export type DatabaseEntryCreatedEventData = DatabaseEntry;
export interface DatabaseEntryUpdatedEventData {
  original: DatabaseEntry;
  updated: DatabaseEntry;
}
export type DatabaseEntryDeletedEventData = DatabaseEntry;
export interface DatabaseEntryRenamedEventData {
  original: DatabaseEntry;
  updated: DatabaseEntry;
}

// Entry metadata event - fired when entry metadata is updated
export const DatabaseEntryMetadataUpdatedEvent =
  'database-entries:entry:metadata-updated';

export interface DatabaseEntryMetadataUpdatedEventData {
  /**
   * The ID of the entry whose metadata was updated.
   */
  entryId: string;

  /**
   * The ID of the database the entry belongs to.
   */
  databaseId: string;

  /**
   * The updated metadata.
   */
  metadata: DatabaseEntryMetadata;
}

// SQL synced events - fired after SQL operations complete

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
