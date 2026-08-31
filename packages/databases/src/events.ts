import { PropertySchema } from '@minddrop/properties';
import { BaseOpenViewEventData } from '@minddrop/views';
import {
  Database,
  DatabaseEntry,
  DatabaseEntryMetadata,
  DatabaseEntryRenderSource,
  DatabaseEntryTemplate,
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
   * The database config from before the property was added.
   */
  original: Database;

  /**
   * The database config with the property added.
   */
  updated: Database;

  /**
   * The property that was added.
   */
  property: PropertySchema;
}

export interface DatabasePropertyRemovedEventData {
  /**
   * The database config from before the property was removed.
   */
  original: Database;

  /**
   * The database config with the property removed.
   */
  updated: Database;

  /**
   * The property that was removed.
   */
  property: PropertySchema;
}

export interface DatabasePropertyRenamedEventData {
  /**
   * The database config from before the property was renamed.
   */
  original: Database;

  /**
   * The database config with the property renamed.
   */
  updated: Database;

  /**
   * The original property name.
   */
  oldName: string;

  /**
   * The new property name.
   */
  newName: string;
}

// Entry template events
export const DatabaseEntryTemplateAddedEvent = 'databases:entry-template:added';
export const DatabaseEntryTemplateUpdatedEvent =
  'databases:entry-template:updated';
export const DatabaseEntryTemplateRemovedEvent =
  'databases:entry-template:removed';

export interface DatabaseEntryTemplateAddedEventData {
  /**
   * The database the entry template was added to.
   */
  database: Database;

  /**
   * The entry template that was added.
   */
  template: DatabaseEntryTemplate;
}

export interface DatabaseEntryTemplateUpdatedEventData {
  /**
   * The database the entry template belongs to.
   */
  database: Database;

  /**
   * The updated entry template.
   */
  template: DatabaseEntryTemplate;
}

export interface DatabaseEntryTemplateRemovedEventData {
  /**
   * The database the entry template was removed from.
   */
  database: Database;

  /**
   * The entry template that was removed.
   */
  template: DatabaseEntryTemplate;
}

// Navigation events
export const OpenDatabaseViewEvent = 'databases:view:open';

export interface OpenDatabaseViewEventData extends BaseOpenViewEventData {
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

export interface OpenDatabaseEntryViewEventData extends BaseOpenViewEventData {
  /**
   * The ID of the database entry to open.
   */
  entryId: string;
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

// Entry duplicated event - fired after an entry is duplicated, before
// the duplicate is added to the source collection
export const DatabaseEntryDuplicatedEvent = 'databases:entry:duplicated';

export interface DatabaseEntryDuplicatedEventData {
  /**
   * The entry that was duplicated.
   */
  original: DatabaseEntry;

  /**
   * The newly created duplicate.
   */
  duplicate: DatabaseEntry;

  /**
   * The source the original entry was rendered from when duplicated.
   */
  source?: DatabaseEntryRenderSource;
}

// Entries cleared event - fired when all of a database's entries are deleted
export const DatabaseEntriesClearedEvent = 'databases:entries:cleared';

export interface DatabaseEntriesClearedEventData {
  /**
   * The ID of the database whose entries were cleared.
   */
  databaseId: string;

  /**
   * The entries that were deleted.
   */
  entries: DatabaseEntry[];
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

// Background sync event - fired after a background sync
// changeset is applied to frontend stores
export const DatabasesBackgroundSyncedEvent = 'databases:sql-background-synced';

export interface DatabasesBackgroundSyncedEventData {
  /**
   * Database configs that were added or changed on disk
   * since the last sync.
   */
  upsertedDatabases: { id: string; name: string; path: string; icon: string }[];

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

// Database reindexed event - fired after a full re-index
export const DatabaseSqlReindexedEvent = 'databases:database:sql-reindexed';

export interface DatabaseSqlReindexedEventData {
  /**
   * The ID of the database that was reindexed.
   */
  databaseId: string;
}

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'databases:database:created': DatabaseCreatedEventData;
    'databases:database:updated': DatabaseUpdatedEventData;
    'databases:database:deleted': DatabaseDeletedEventData;
    'databases:database:renamed': DatabaseRenamedEventData;
    'databases:property:added': DatabasePropertyAddedEventData;
    'databases:property:removed': DatabasePropertyRemovedEventData;
    'databases:property:renamed': DatabasePropertyRenamedEventData;
    'databases:entry-template:added': DatabaseEntryTemplateAddedEventData;
    'databases:entry-template:updated': DatabaseEntryTemplateUpdatedEventData;
    'databases:entry-template:removed': DatabaseEntryTemplateRemovedEventData;
    'databases:view:open': OpenDatabaseViewEventData;
    'database-entries:entry:open': OpenDatabaseEntryViewEventData;
    'databases:entry:created': DatabaseEntryCreatedEventData;
    'databases:entry:updated': DatabaseEntryUpdatedEventData;
    'databases:entry:deleted': DatabaseEntryDeletedEventData;
    'databases:entry:renamed': DatabaseEntryRenamedEventData;
    'databases:entry:duplicated': DatabaseEntryDuplicatedEventData;
    'databases:entries:cleared': DatabaseEntriesClearedEventData;
    'database-entries:entry:metadata-updated': DatabaseEntryMetadataUpdatedEventData;
    'database-entries:sql-synced': DatabaseEntriesSqlSyncedEventData;
    'databases:database:sql-synced': DatabaseSqlSyncedEventData;
    'databases:property:sql-synced': DatabasePropertySqlSyncedEventData;
    'databases:sql-background-synced': DatabasesBackgroundSyncedEventData;
    'databases:database:sql-reindexed': DatabaseSqlReindexedEventData;
  }
}
