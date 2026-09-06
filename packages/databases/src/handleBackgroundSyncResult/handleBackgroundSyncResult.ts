import { DataViews } from '@minddrop/data-views';
import { Designs } from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { ItemAddressChange, ItemReferences } from '@minddrop/item-references';
import { restoreDates } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesBackgroundSyncedEvent } from '../events';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { getDatabaseEntryTemplates } from '../getDatabaseEntryTemplates';
import { loadDatabaseDesigns } from '../loadDatabaseDesigns';
import { loadDatabaseEntryTemplates } from '../loadDatabaseEntryTemplates';
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

  // Load views, designs, and entry templates for newly
  // upserted databases.
  if (upsertedDatabases.length > 0) {
    await Promise.all([
      loadDatabaseViews(upsertedDatabases),
      loadDatabaseDesigns(upsertedDatabases),
      loadDatabaseEntryTemplates(upsertedDatabases),
    ]);
  }

  // Remove deleted databases before their views, designs, and
  // templates, so that the item removals cannot write into the
  // deleted databases' directories.
  for (const id of changeset.deletedDatabaseIds) {
    DatabasesStore.remove(id);
  }

  // Delete views belonging to deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    const databaseViews = DataViews.getByDataSource('database', id);

    for (const view of databaseViews) {
      DataViews.delete(view.id);
    }
  }

  // Delete designs belonging to deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    const databaseDesigns = Designs.getByOwner(id);

    for (const design of databaseDesigns) {
      Designs.delete(design.id);
    }
  }

  // Remove entry templates belonging to deleted databases from
  // the store.
  for (const id of changeset.deletedDatabaseIds) {
    getDatabaseEntryTemplates(id).forEach((template) =>
      DatabaseEntryTemplatesStore.remove(template.id),
    );
  }

  // Address changes of entries that were renamed or moved between
  // databases while the app was not running.
  const addressChanges: ItemAddressChange[] = [];

  // Upsert new or updated entries. Record IDs are path-matched to
  // existing SQL rows during the sync, so records for entries already
  // in the store replace them under their existing key.
  for (const record of changeset.upsertedEntries) {
    const entry = convertSqlRecordToEntry(record);
    const existing = getDatabaseEntry(entry.id, false);

    // Only a changed title or database changes an entry's address, so
    // a file that moved without being renamed is not an address change.
    const addressChanged =
      existing &&
      (existing.title !== entry.title || existing.database !== entry.database);

    if (addressChanged) {
      const oldReference = databaseEntryAddress(existing);
      const newReference = databaseEntryAddress(entry);

      // The entry must be nameable either side of the change
      if (oldReference && newReference) {
        addressChanges.push({ id: entry.id, oldReference, newReference });
      }
    }

    DatabaseEntriesStore.set(entry);
  }

  // Remove deleted entries
  for (const id of changeset.deletedEntryIds) {
    DatabaseEntriesStore.remove(id);
  }

  // Dispatch the moved entries' address changes
  if (addressChanges.length > 0) {
    Events.dispatch(ItemReferences.events.AddressesChanged, addressChanges);
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

  // Remove deleted entries from collections and view configs
  // referencing them.
  if (changeset.deletedEntryIds.length > 0) {
    await removeEntriesFromCollections(changeset.deletedEntryIds);
    await DataViews.removeReferences(changeset.deletedEntryIds);
  }
}
