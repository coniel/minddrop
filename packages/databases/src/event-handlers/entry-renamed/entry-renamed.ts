import { Collections } from '@minddrop/collections';
import { Designs } from '@minddrop/designs';
import { DataViews } from '@minddrop/views';
import { DatabaseEntryRenamedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { sqlDeleteEntries, sqlUpsertEntries } from '../../sql';
import { flushDatabaseMetadata } from '../../updateEntryMetadata';
import { rekeyPendingMetadata } from '../../updateEntryMetadata/updateEntryMetadata';
import {
  convertEntryToSqlRecord,
  entryMetadataKey,
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

  // Metadata is keyed by the database-relative entry path
  const oldMetadataKey = entryMetadataKey(original.path, database.path);
  const newMetadataKey = entryMetadataKey(updated.path, database.path);

  // Step 2: Re-key the on-disk metadata file from old to new entry ID
  await rekeyDatabaseMetadata(database.path, oldMetadataKey, newMetadataKey);

  // Step 3: Re-key any in-flight pending metadata entries
  rekeyPendingMetadata(database.path, oldMetadataKey, newMetadataKey);

  // Step 4: Remove the orphaned SQL record under the old ID
  sqlDeleteEntries(database.id, [original.id]);

  // Step 5: Insert the new SQL record under the new ID
  const record = convertEntryToSqlRecord(updated, database);
  sqlUpsertEntries(database.id, [record]);

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Nothing left to do if there are no collection properties
  if (collectionProperties.length === 0) {
    return;
  }

  // Re-ID virtual collections and views
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

      // Re-ID virtual views for each layout in the database's design
      const design = database.designId
        ? Designs.get(database.designId, false)
        : null;
      const layoutIds = design ? design.layouts.map((layout) => layout.id) : [];

      await Promise.all(
        layoutIds.map(async (layoutId) => {
          const oldViewId = virtualViewId(original.id, property.name, layoutId);
          const newViewId = virtualViewId(updated.id, property.name, layoutId);

          // Only update if the view exists
          const view = DataViews.Store.get(oldViewId);

          if (!view) {
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
  );
}
