import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  DatabaseRenamedEventData,
  DatabaseSqlSyncedEvent,
  DatabaseSqlSyncedEventData,
} from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { loadDatabaseViews } from '../../loadDatabaseViews';
import { rewriteEntryReferences } from '../../rewriteEntryReferences';
import {
  sqlDeleteDatabase,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  convertEntryToSqlRecord,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database is renamed. A rename changes the database ID,
 * so entries are updated to reference the new database ID and path
 * prefix, and database-derived state (SQL records, views, virtual
 * collection names) is refreshed.
 *
 * The on-disk metadata file needs no changes: its keys are database-
 * relative (see `entryMetadataKey`), so they are unaffected by the
 * database path change.
 */
export async function onRenameDatabase(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { original, updated } = data;

  // Read the entries under the old database ID
  const entries = getAllDatabaseEntries(original.id);

  // Build the updated entries, swapping the database path prefix
  // and database reference
  const renamedEntries = entries.map((entry) => ({
    ...entry,
    path: `${updated.path}${entry.path.slice(original.path.length)}`,
    database: updated.id,
  }));

  // Update each entry in place in the store
  renamedEntries.forEach((entry) => {
    DatabaseEntriesStore.update(entry.id, {
      path: entry.path,
      database: entry.database,
    });
  });

  // Delete the old database record. CASCADE silently removes its entries,
  // so no SQL synced events fire for them.
  sqlDeleteDatabase(original.id, { silent: true });

  // Dispatch a database delete event for the old ID
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'delete',
    databaseId: original.id,
  });

  // Insert the renamed database under the new ID
  sqlUpsertDatabase({
    id: updated.id,
    name: updated.name,
    path: updated.path,
    icon: updated.icon,
  });

  // Re-upsert all entries under the new database ID
  if (renamedEntries.length > 0) {
    const records = renamedEntries.map((entry) =>
      convertEntryToSqlRecord(entry, updated),
    );

    sqlUpsertEntries(updated.id, records);
  }

  // Reload the database's browse views so they re-derive their data
  // source from the new database ID
  loadDatabaseViews([updated]);

  // Find collection properties in the database schema
  const collectionProperties = updated.properties.filter(
    (property) => property.type === 'collection',
  );

  // Update virtual collection names, which embed the database name
  await Promise.all(
    renamedEntries.map((entry) =>
      Promise.all(
        collectionProperties.map(async (property) => {
          const collectionId = virtualCollectionId(entry.id, property.name);

          // Skip if the virtual collection does not exist
          if (!Collections.Store.get(collectionId)) {
            return;
          }

          // Derive the collection name from the new database name
          const name = virtualCollectionName(
            updated.name,
            entry.title,
            property.name,
          );

          // Update the collection's name
          await Collections.update(collectionId, { name });
        }),
      ),
    ),
  );

  // Rewrite referencing files with the entries' new addresses
  await rewriteEntryReferences(renamedEntries.map((entry) => entry.id));
}
