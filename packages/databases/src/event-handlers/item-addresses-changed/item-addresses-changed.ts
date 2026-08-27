import { DataViews } from '@minddrop/data-views';
import { ItemAddressesChangedEventData } from '@minddrop/item-references';
import { isEntityId } from '@minddrop/utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import { persistVirtualViewConfig } from '../../persistVirtualViewConfig';
import { sqlUpsertEntries } from '../../sql';
import { SqlEntryRecord } from '../../types';
import { convertEntryToSqlRecord, getReferencingEntries } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Refreshes changed entries' SQL records, rewrites entry files
 * whose collection properties reference changed items, and
 * re-persists embedded view configs referencing them, so SQL and
 * durable references stay current.
 *
 * @param changes - The item address changes.
 */
export async function onItemAddressesChanged(
  changes: ItemAddressesChangedEventData,
): Promise<void> {
  // Collect the changed item IDs
  const changedIds = changes.map((change) => change.id);

  // Group the changed entries' SQL records by database
  const recordsByDatabase = new Map<string, SqlEntryRecord[]>();

  changedIds.forEach((id) => {
    // Skip changed items that are not entries
    const entry = DatabaseEntriesStore.get(id);

    if (!entry) {
      return;
    }

    // Skip entries whose database no longer exists
    const database = DatabasesStore.get(entry.database);

    if (!database) {
      return;
    }

    // Add the entry's record to its database's group
    const records = recordsByDatabase.get(entry.database) ?? [];

    records.push(convertEntryToSqlRecord(entry, database));
    recordsByDatabase.set(entry.database, records);
  });

  // Update the changed entries' SQL records
  recordsByDatabase.forEach((records, databaseId) => {
    sqlUpsertEntries(databaseId, records);
  });

  // Find entries referencing the changed items
  const referencingEntries = getReferencingEntries(changedIds);

  // Rewrite each referencing entry's file
  await Promise.all(
    referencingEntries.map((entry) => writeDatabaseEntry(entry.id)),
  );

  // Re-persist embedded view configs referencing the changed items
  await Promise.all(
    DataViews.getReferencing(changedIds)
      .filter((view) => view.owner && isEntityId(view.owner, 'database-entry'))
      .map(persistVirtualViewConfig),
  );
}
