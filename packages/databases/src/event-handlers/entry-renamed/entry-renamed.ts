import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { History } from '@minddrop/history';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import {
  contentCaptureKey,
  moveContentCapture,
} from '../../contentCaptureRegistry';
import { DatabaseEntryRenamedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { moveEntryMetadataFile } from '../../moveEntryMetadataFile';
import {
  databaseEntryAddress,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database entry is renamed. Updates title-derived
 * state: the metadata sidecar, the entry's history, and virtual
 * collection names.
 */
export async function onRenameEntry(data: DatabaseEntryRenamedEventData) {
  const { original, updated } = data;

  // Get the database to access its properties schema
  const database = getDatabase(updated.database);

  // Move the sidecar to follow the entry to its new path
  await moveEntryMetadataFile(database.path, original.path, updated.path);

  // Record the rename before moving the history, so it lands in the
  // log the move carries across.
  await History.record({
    ownerPath: database.path,
    subjectKey: original.title,
    kind: 'rename',
    target: 'self',
    from: original.title,
    to: updated.title,
  });

  // Move the history to follow the entry to its new title
  await History.move({
    ownerPath: database.path,
    fromKey: original.title,
    toKey: updated.title,
  });

  // Move the entry's recorded capture along with it
  moveContentCapture(
    contentCaptureKey(database.path, original.title),
    contentCaptureKey(database.path, updated.title),
  );

  // Find all collection properties in the schema
  const collectionProperties = database.properties.filter(
    (property) => property.type === 'collection',
  );

  // Update virtual collection names, which embed the entry title
  await Promise.all(
    collectionProperties.map(async (property) => {
      const collectionId = virtualCollectionId(updated.id, property.name);

      // Skip if the virtual collection does not exist
      if (!Collections.get(collectionId, false)) {
        return;
      }

      // Derive the collection name from the new entry title
      const name = virtualCollectionName(
        database.name,
        updated.title,
        property.name,
      );

      // Update the collection's name
      await Collections.update(collectionId, { name });
    }),
  );

  // Dispatch the entry's address change
  Events.dispatch(ItemAddressesChangedEvent, [
    {
      id: updated.id,
      oldReference: databaseEntryAddress(original, database),
      newReference: databaseEntryAddress(updated, database),
    },
  ]);
}
