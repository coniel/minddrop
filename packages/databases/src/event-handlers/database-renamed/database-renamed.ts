import { Collections } from '@minddrop/collections';
import { Designs } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { DataViews } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntriesSqlSyncedEventData,
  DatabaseRenamedEventData,
  DatabaseSqlSyncedEvent,
  DatabaseSqlSyncedEventData,
} from '../../events';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import {
  sqlDeleteDatabase,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  convertEntryToSqlRecord,
  virtualCollectionId,
  virtualCollectionName,
  virtualViewId,
} from '../../utils';

/**
 * Called when a database is renamed. A rename changes the database ID
 * and, because entry IDs are database-prefixed workspace paths, the ID
 * of every entry too. Cascades that change through the entry store, SQL,
 * search, and virtual collections/views.
 *
 * The on-disk metadata file needs no changes: its keys are database-
 * relative (see `entryMetadataKey`), so they are unaffected by the
 * database prefix change.
 */
export async function onRenameDatabase(
  data: DatabaseRenamedEventData,
): Promise<void> {
  const { original, updated } = data;

  // Read entries under the OLD database ID. The store has not been
  // re-keyed yet, so entries still carry their pre-rename IDs.
  const entries = getAllDatabaseEntries(original.id);

  // Build the renamed entries, deriving each new ID/path by swapping the
  // old database prefix for the new one. Track old -> new entry IDs for
  // re-keying collections and views further down.
  const idMap = new Map<string, string>();

  const renames = entries.map((entry) => {
    // Swap the database ID prefix in the workspace-relative entry ID
    const id = `${updated.id}${entry.id.slice(original.id.length)}`;

    // Swap the database path prefix in the absolute entry path
    const path = `${updated.path}${entry.path.slice(original.path.length)}`;

    // Record the mapping for later re-keying steps
    idMap.set(entry.id, id);

    return {
      original: entry,
      updated: { ...entry, id, path, database: updated.id },
    };
  });

  // Swap each entry in the frontend store: add under the new ID, then
  // remove the old key
  renames.forEach(({ updated: renamed }) => {
    DatabaseEntriesStore.set(renamed);
  });
  renames.forEach(({ original: entry }) => {
    DatabaseEntriesStore.remove(entry.id);
  });

  // Delete the old database record. CASCADE silently removes its entries,
  // so no SQL synced events fire for them.
  sqlDeleteDatabase(original.id, { silent: true });

  // Dispatch a database delete event for the old ID so search drops the
  // stale database record left behind by the silent delete
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
  if (renames.length > 0) {
    const records = renames.map(({ updated: renamed }) =>
      convertEntryToSqlRecord(renamed, updated),
    );

    sqlUpsertEntries(updated.id, records);

    // Dispatch a delete event for the old entry IDs so search drops the
    // orphaned documents left behind by the silent CASCADE delete
    Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
      DatabaseEntriesSqlSyncedEvent,
      {
        action: 'delete',
        entryIds: renames.map(({ original: entry }) => entry.id),
        databaseId: original.id,
      },
    );
  }

  // Find collection properties in the database schema
  const collectionProperties = updated.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing left to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Resolve the database's design to enumerate its layout IDs, which
  // key the virtual views backing each collection property
  const design = updated.designId ? Designs.get(updated.designId, false) : null;
  const layoutIds = design ? design.layouts.map((layout) => layout.id) : [];

  // Re-ID virtual collections and views for every entry
  await Promise.all(
    renames.map(({ original: entry, updated: renamed }) =>
      Promise.all(
        collectionProperties.map(async (property) => {
          const oldCollectionId = virtualCollectionId(entry.id, property.name);
          const newCollectionId = virtualCollectionId(
            renamed.id,
            property.name,
          );

          // Re-ID the virtual collection if it exists
          const collection = Collections.Store.get(oldCollectionId);

          if (collection) {
            // Remap member entry IDs that belong to the renamed database
            const memberEntries = collection.entries.map(
              (memberId) => idMap.get(memberId) ?? memberId,
            );

            // Reflect the new database name in the collection name
            const name = virtualCollectionName(
              updated.name,
              entry.title,
              property.name,
            );

            await Collections.update(oldCollectionId, {
              id: newCollectionId,
              name,
              entries: memberEntries,
            });
          }

          // Re-ID the virtual views backing this property in each layout
          await Promise.all(
            layoutIds.map(async (layoutId) => {
              const oldViewId = virtualViewId(
                entry.id,
                property.name,
                layoutId,
              );
              const newViewId = virtualViewId(
                renamed.id,
                property.name,
                layoutId,
              );

              // Only update if the view exists
              if (!DataViews.Store.get(oldViewId)) {
                return;
              }

              // Update the view ID and point dataSource to the new collection
              await DataViews.update(oldViewId, {
                id: newViewId,
                dataSource: { type: 'collection', id: newCollectionId },
              });
            }),
          );
        }),
      ),
    ),
  );
}
