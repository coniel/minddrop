import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { History } from '@minddrop/history';
import { ItemReferences } from '@minddrop/item-references';
import { isUntitledTitle } from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import {
  contentCaptureKey,
  moveContentCapture,
} from '../../contentCaptureRegistry';
import { DatabaseEntryRenamedEventData } from '../../events';
import { getDatabase } from '../../getDatabase';
import { moveEntryMetadataFile } from '../../moveEntryMetadataFile';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import { recordDatabaseEntryLedger } from '../../recordDatabaseEntryLedger';
import { sqlUpsertEntries } from '../../sql';
import {
  convertEntryToSqlRecord,
  databaseEntryAddress,
  resolveDatabaseEntryHistorySubject,
  resolveDatabasePath,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';

/**
 * Called when a database entry is renamed. Updates the state derived
 * from its title.
 *
 * @param data - The renamed entry's data.
 */
export async function onRenameEntry(data: DatabaseEntryRenamedEventData) {
  const { original, updated, action } = data;

  // Get the database to access its properties schema
  const database = getDatabase(updated.database);
  const databasePath = resolveDatabasePath(database);

  // Refresh the SQL record, which holds the entry's title
  sqlUpsertEntries(database.id, [convertEntryToSqlRecord(updated, database)]);

  // Move the sidecar to follow the entry to its new path
  await moveEntryMetadataFile(databasePath, original.path, updated.path);

  // Record the rename before moving the history, so it lands in the
  // log the move carries across.
  await recordDatabaseEntryHistory(database, original, {
    kind: 'rename',
    target: 'self',
    from: original.title,
    to: updated.title,
    action,
  });

  // Resolve the entry's history subject
  const { ownerPath, subjectType } = resolveDatabaseEntryHistorySubject(
    database,
    original,
  );

  // Move the history to follow the entry to its new title
  await History.move({
    ownerPath,
    subjectType,
    fromKey: original.title,
    toKey: updated.title,
  });

  // Record the rename in the entries ledger under the old title, unless
  // the entry was still untitled. Nearly every entry is renamed from
  // the title the app hands out, and nothing references it by that
  // title.
  if (!isUntitledTitle(original.title)) {
    await recordDatabaseEntryLedger(database, {
      kind: 'rename',
      subject: { key: original.title },
      to: updated.title,
      action,
    });
  }

  // Move the entry's recorded capture along with it
  moveContentCapture(
    contentCaptureKey(databasePath, original.title),
    contentCaptureKey(databasePath, updated.title),
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
  Events.dispatch(ItemReferences.events.AddressesChanged, {
    workspaceId: Workspaces.getActive().id,
    changes: [
      {
        id: updated.id,
        oldReference: databaseEntryAddress(original, database),
        newReference: databaseEntryAddress(updated, database),
      },
    ],
    action,
  });
}
