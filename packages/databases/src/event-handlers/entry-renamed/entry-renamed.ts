import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Views } from '@minddrop/views';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryRenamedEventData,
} from '../../events';
import type { DatabaseEntriesSqlSyncedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { deleteEntries, upsertEntries } from '../../sql';
import { flushDatabaseMetadata } from '../../updateEntryMetadata';
import { rekeyPendingMetadata } from '../../updateEntryMetadata/updateEntryMetadata';
import {
  convertEntryToSqlRecord,
  rekeyDatabaseMetadata,
  virtualCollectionId,
  virtualCollectionName,
  virtualViewId,
} from '../../utils';

/**
 * Called when a database entry is renamed. Cascades the ID
 * change through SQL, metadata, and virtual collections/views.
 */
export async function onRenameEntry(data: DatabaseEntryRenamedEventData) {
  const { original, updated } = data;

  // Get the database to access its properties schema
  const database = getDatabase(updated.database);

  // Step 1: Flush any pending metadata writes so nothing is lost
  await flushDatabaseMetadata(database.path);

  // Step 2: Re-key the on-disk metadata file from old to new entry ID
  await rekeyDatabaseMetadata(database.path, original.id, updated.id);

  // Step 3: Re-key any in-flight pending metadata entries
  rekeyPendingMetadata(database.path, original.id, updated.id);

  // Step 4: Remove the orphaned SQL record under the old ID
  deleteEntries([original.id]);

  // Step 5: Insert the new SQL record under the new ID
  const record = convertEntryToSqlRecord(updated, database);
  upsertEntries([record]);

  // Dispatch SQL synced delete event for the old entry
  Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
    DatabaseEntriesSqlSyncedEvent,
    {
      action: 'delete',
      entryIds: [original.id],
      databaseId: database.id,
    },
  );

  // Dispatch SQL synced upsert event for the new entry
  Events.dispatch<DatabaseEntriesSqlSyncedEventData>(
    DatabaseEntriesSqlSyncedEvent,
    {
      action: 'upsert',
      entryIds: [record.id],
      databaseId: database.id,
      entries: [record],
    },
  );

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing left to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Step 8-9: Re-ID virtual collections and views
  await Promise.all(
    collectionProperties.map(async (property) => {
      const oldCollectionId = virtualCollectionId(original.id, property.name);
      const newCollectionId = virtualCollectionId(updated.id, property.name);

      // Re-ID the virtual collection if it exists
      if (Collections.Store.get(oldCollectionId)) {
        const name = virtualCollectionName(
          database.name,
          updated.title,
          property.name,
        );

        await Collections.update(oldCollectionId, {
          id: newCollectionId,
          name,
        });
      }

      // Re-ID virtual views for each design that has a property map
      const designIds = Object.keys(database.designPropertyMaps || {});

      await Promise.all(
        designIds.map(async (designId) => {
          const oldViewId = virtualViewId(original.id, property.name, designId);
          const newViewId = virtualViewId(updated.id, property.name, designId);

          // Only update if the view exists
          const view = Views.Store.get(oldViewId);

          if (!view) {
            return;
          }

          // Update the view ID and point dataSource to the new collection
          await Views.update(oldViewId, {
            id: newViewId,
            dataSource: { type: 'collection', id: newCollectionId },
          });
        }),
      );
    }),
  );
}
