import { Events } from '@minddrop/events';
import { restoreDates } from '@minddrop/utils';
import { DatabaseEntriesStore } from './DatabaseEntriesStore';
import { DatabasesStore } from './DatabasesStore';
import { DatabasesBackgroundSyncedEvent } from './events';
import type { BackgroundSyncChangeset, Database } from './types';
import { convertSqlRecordToEntry } from './utils';

/**
 * Applies a background sync changeset to frontend stores
 * and dispatches a background synced event so that listeners
 * (e.g. search) can update accordingly.
 *
 * Called when the backend sends a changeset message after
 * scanning the filesystem for changes.
 */
export function handleBackgroundSyncResult(
  changeset: BackgroundSyncChangeset,
): void {
  // Upsert new or updated databases
  for (const database of changeset.upsertedDatabases) {
    DatabasesStore.set(restoreDates<Database>(database));
  }

  // Remove deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    DatabasesStore.remove(id);
  }

  // Upsert new or updated entries
  for (const record of changeset.upsertedEntries) {
    DatabaseEntriesStore.set(convertSqlRecordToEntry(record));
  }

  // Remove deleted entries
  for (const id of changeset.deletedEntryIds) {
    DatabaseEntriesStore.remove(id);
  }

  // Dispatch a single event with the full changeset
  Events.dispatch(DatabasesBackgroundSyncedEvent, {
    upsertedDatabases: changeset.upsertedDatabases.map((database) => ({
      id: database.id,
      name: database.name,
      path: database.path,
      icon: database.icon,
    })),
    deletedDatabaseIds: changeset.deletedDatabaseIds,
    upsertedEntries: changeset.upsertedEntries,
    deletedEntryIds: changeset.deletedEntryIds,
  });
}
