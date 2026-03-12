import type {
  DatabaseCreatedEventData,
  DatabaseDeletedEventData,
  DatabaseEntryCreatedEventData,
  DatabaseEntryDeletedEventData,
  DatabaseEntryRenamedEventData,
  DatabaseEntryUpdatedEventData,
  DatabasePropertyAddedEventData,
  DatabasePropertyRemovedEventData,
  DatabasePropertyRenamedEventData,
  DatabaseRenamedEventData,
  DatabaseUpdatedEventData,
} from '@minddrop/databases';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  onAddProperty,
  onCreateDatabase,
  onCreateEntry,
  onDeleteDatabase,
  onDeleteEntry,
  onRemoveProperty,
  onRenameDatabase,
  onRenameEntry,
  onRenameProperty,
  onUpdateDatabase,
  onUpdateEntry,
} from './event-handlers';

// Listener ID for all sql-databases event handlers
const LISTENER_ID = 'sql-databases:sync';

/**
 * Registers sql-databases event handlers that listen to
 * database domain events and sync changes to SQL. Each
 * handler dispatches a corresponding synced event after
 * the SQL operation completes.
 *
 * Should be called after `Databases.initialize()` and after
 * the SQL database has been opened via `Sql.open()`.
 */
export function initializeDatabasesSql(): void {
  // Entry events
  Events.on<DatabaseEntryCreatedEventData>(
    DatabaseEntries.events.created,
    LISTENER_ID,
    ({ data }) => {
      onCreateEntry(data);
    },
  );

  Events.on<DatabaseEntryUpdatedEventData>(
    DatabaseEntries.events.updated,
    LISTENER_ID,
    ({ data }) => {
      onUpdateEntry(data);
    },
  );

  Events.on<DatabaseEntryDeletedEventData>(
    DatabaseEntries.events.deleted,
    LISTENER_ID,
    ({ data }) => {
      onDeleteEntry(data);
    },
  );

  Events.on<DatabaseEntryRenamedEventData>(
    DatabaseEntries.events.renamed,
    LISTENER_ID,
    ({ data }) => {
      onRenameEntry(data);
    },
  );

  // Database events
  Events.on<DatabaseCreatedEventData>(
    Databases.events.created,
    LISTENER_ID,
    ({ data }) => {
      onCreateDatabase(data);
    },
  );

  Events.on<DatabaseUpdatedEventData>(
    Databases.events.updated,
    LISTENER_ID,
    ({ data }) => {
      onUpdateDatabase(data);
    },
  );

  Events.on<DatabaseDeletedEventData>(
    Databases.events.deleted,
    LISTENER_ID,
    ({ data }) => {
      onDeleteDatabase(data);
    },
  );

  Events.on<DatabaseRenamedEventData>(
    Databases.events.renamed,
    LISTENER_ID,
    ({ data }) => {
      onRenameDatabase(data);
    },
  );

  // Property events
  Events.on<DatabasePropertyAddedEventData>(
    Databases.events.propertyAdded,
    LISTENER_ID,
    ({ data }) => {
      onAddProperty(data);
    },
  );

  Events.on<DatabasePropertyRemovedEventData>(
    Databases.events.propertyRemoved,
    LISTENER_ID,
    ({ data }) => {
      onRemoveProperty(data);
    },
  );

  Events.on<DatabasePropertyRenamedEventData>(
    Databases.events.propertyRenamed,
    LISTENER_ID,
    ({ data }) => {
      onRenameProperty(data);
    },
  );

  console.log('[sql-databases] Event handlers registered');
}
