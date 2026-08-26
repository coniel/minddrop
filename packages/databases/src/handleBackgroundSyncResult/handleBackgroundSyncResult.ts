import { DataViews } from '@minddrop/data-views';
import { Events } from '@minddrop/events';
import {
  ItemAddressChange,
  ItemAddressesChangedEvent,
} from '@minddrop/item-references';
import { restoreDates } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesBackgroundSyncedEvent } from '../events';
import { loadDatabaseViews } from '../loadDatabaseViews';
import { removeEntriesFromCollections } from '../removeEntriesFromCollections';
import type { BackgroundSyncChangeset, Database } from '../types';
import { convertSqlRecordToEntry, databaseEntryAddress } from '../utils';

/**
 * Applies a background sync changeset to frontend stores
 * and dispatches a background synced event so that listeners
 * (e.g. search) can update accordingly.
 *
 * Called when the backend sends a changeset message after
 * scanning the filesystem for changes.
 */
export async function handleBackgroundSyncResult(
  changeset: BackgroundSyncChangeset,
): Promise<void> {
  // Upsert new or updated databases
  const upsertedDatabases: Database[] = [];

  for (const database of changeset.upsertedDatabases) {
    const restored = restoreDates<Database>(database);

    DatabasesStore.set(restored);
    upsertedDatabases.push(restored);
  }

  // Load views for newly upserted databases
  if (upsertedDatabases.length > 0) {
    loadDatabaseViews(upsertedDatabases);
  }

  // Delete views belonging to deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    const databaseViews = DataViews.getByDataSource('database', id);

    for (const view of databaseViews) {
      DataViews.delete(view.id);
    }
  }

  // Remove deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    DatabasesStore.remove(id);
  }

  // Address changes of entries that moved while the app was not
  // running
  const addressChanges: ItemAddressChange[] = [];

  // Upsert new or updated entries. Record IDs are path-matched to
  // existing SQL rows during the sync, so records for entries already
  // in the store replace them under their existing key.
  for (const record of changeset.upsertedEntries) {
    const entry = convertSqlRecordToEntry(record);
    const existing = DatabaseEntriesStore.get(entry.id);

    // Record the address change when an existing entry moved
    if (existing && existing.path !== entry.path) {
      addressChanges.push({
        id: entry.id,
        oldReference: databaseEntryAddress(existing.path),
        newReference: databaseEntryAddress(entry.path),
      });
    }

    DatabaseEntriesStore.set(entry);
  }

  // Remove deleted entries
  for (const id of changeset.deletedEntryIds) {
    DatabaseEntriesStore.remove(id);
  }

  // Remove deleted entries from collections and view configs
  // referencing them
  if (changeset.deletedEntryIds.length > 0) {
    await removeEntriesFromCollections(changeset.deletedEntryIds);
    await DataViews.removeReferences(changeset.deletedEntryIds);
  }

  // Dispatch the moved entries' address changes
  if (addressChanges.length > 0) {
    await Events.dispatch(ItemAddressesChangedEvent, addressChanges);
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
