import { DataViews } from '@minddrop/data-views';
import { Designs } from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { ItemAddressChange, ItemReferences } from '@minddrop/item-references';
import { restoreDates } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabaseEntryTemplatesStore } from '../DatabaseEntryTemplatesStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { DatabasesBackgroundSyncedEvent } from '../events';
import { loadDatabaseDesigns } from '../loadDatabaseDesigns';
import { loadDatabaseEntryTemplates } from '../loadDatabaseEntryTemplates';
import { loadDatabaseViews } from '../loadDatabaseViews';
import { removeEntriesFromCollections } from '../removeEntriesFromCollections';
import type { BackgroundSyncChangeset, Database } from '../types';
import { convertSqlRecordToEntry, databaseEntryAddress } from '../utils';

/**
 * Applies a background sync changeset to the synced workspace's
 * store records and dispatches a background synced event so that
 * listeners (e.g. search) can update accordingly.
 *
 * Called when the backend sends a changeset message after
 * scanning the filesystem for changes.
 */
export async function handleBackgroundSyncResult(
  changeset: BackgroundSyncChangeset,
): Promise<void> {
  const workspace = Workspaces.get(changeset.workspaceId);
  const databasesStore = DatabasesStore.in(workspace.id);
  const entriesStore = DatabaseEntriesStore.in(workspace.id);
  const templatesStore = DatabaseEntryTemplatesStore.in(workspace.id);

  // Upsert new or updated databases
  const upsertedDatabases: Database[] = [];

  for (const database of changeset.upsertedDatabases) {
    const restored = restoreDates<Database>(database);

    databasesStore.set(restored);
    upsertedDatabases.push(restored);
  }

  // Load views, designs, and entry templates for newly
  // upserted databases.
  if (upsertedDatabases.length > 0) {
    await Promise.all([
      loadDatabaseViews(upsertedDatabases, workspace),
      loadDatabaseDesigns(upsertedDatabases, workspace),
      loadDatabaseEntryTemplates(upsertedDatabases, workspace),
    ]);
  }

  // Remove deleted databases before their views, designs, and
  // templates, so that the item removals cannot write into the
  // deleted databases' directories.
  for (const id of changeset.deletedDatabaseIds) {
    databasesStore.remove(id);
  }

  // Delete views belonging to deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    const databaseViews = DataViews.getByDataSource(
      'database',
      id,
      workspace.id,
    );

    for (const view of databaseViews) {
      DataViews.delete(view.id, workspace.id);
    }
  }

  // Delete designs belonging to deleted databases
  for (const id of changeset.deletedDatabaseIds) {
    const databaseDesigns = Designs.getByOwner(id, workspace.id);

    for (const design of databaseDesigns) {
      Designs.delete(design.id, workspace.id);
    }
  }

  // Remove entry templates belonging to deleted databases from
  // the store.
  for (const id of changeset.deletedDatabaseIds) {
    templatesStore
      .getAllArray()
      .filter((template) => template.database === id)
      .forEach((template) => templatesStore.remove(template.id));
  }

  // Address changes of entries that were renamed or moved between
  // databases while the app was not running.
  const addressChanges: ItemAddressChange[] = [];

  // Upsert new or updated entries. Record IDs are path-matched to
  // existing SQL rows during the sync, so records for entries already
  // in the store replace them under their existing key.
  for (const record of changeset.upsertedEntries) {
    const database = databasesStore.get(record.databaseId);

    if (!database) {
      throw new DatabaseNotFoundError(record.databaseId);
    }

    const entry = convertSqlRecordToEntry(record, database);
    const existing = entriesStore.get(entry.id);

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

    entriesStore.set(entry);
  }

  // Remove deleted entries
  for (const id of changeset.deletedEntryIds) {
    entriesStore.remove(id);
  }

  // Dispatch the moved entries' address changes
  if (addressChanges.length > 0) {
    Events.dispatch(ItemReferences.events.AddressesChanged, {
      workspaceId: workspace.id,
      changes: addressChanges,
    });
  }

  // Dispatch a single event with the full changeset
  Events.dispatch(DatabasesBackgroundSyncedEvent, {
    workspaceId: workspace.id,
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
    await removeEntriesFromCollections(changeset.deletedEntryIds, workspace.id);
    await DataViews.removeReferences(changeset.deletedEntryIds, workspace.id);
  }
}
