import { Properties } from '@minddrop/properties';
import { TagDeletedEventData } from '@minddrop/tags';
import { EntriesStore } from '../../EntriesStore';
import { getAllDatabases } from '../../getAllDatabases';
import { getAllEntries } from '../../getAllEntries';
import { recordEntryHistory } from '../../recordEntryHistory';
import { sqlUpsertEntries } from '../../sql';
import { SqlEntryRecord } from '../../types';
import {
  convertEntryToSqlRecord,
  rewriteEntryPropertyValues,
} from '../../utils';
import { writeEntry } from '../../writeEntry';

/**
 * Called when a tag is deleted. Removes the tag's name from the
 * tags property values of every entry referencing it.
 */
export async function onTagDeleted(data: TagDeletedEventData): Promise<void> {
  const { name, action } = data;

  // Rewrite matching entries database by database
  for (const database of getAllDatabases()) {
    // Resolve the names of the database's tags properties
    const tagsPropertyNames = Properties.resolveNamesOfType(
      database.properties,
      'tags',
    );

    // Skip databases without tags properties
    if (tagsPropertyNames.length === 0) {
      continue;
    }

    // The rewritten entries' SQL records, upserted as a batch
    const updatedRecords: SqlEntryRecord[] = [];

    for (const entry of getAllEntries(database.id)) {
      // Remove the deleted tag from the entry's tags values
      const rewritten = rewriteEntryPropertyValues(
        entry,
        tagsPropertyNames,
        (value) => Properties.removeValue(value, name),
      );

      // Skip entries which do not reference the deleted tag
      if (!rewritten) {
        continue;
      }

      // Update the entry in the store
      EntriesStore.update(entry.id, rewritten.entry);

      // Write the updated entry to the file system
      await writeEntry(entry.id);

      // Record every value the deletion changed in one record
      await recordEntryHistory(database, entry, {
        kind: 'property',
        changes: rewritten.changes,
        action,
      });

      // Queue the entry's SQL record for the batch upsert
      updatedRecords.push(convertEntryToSqlRecord(rewritten.entry, database));
    }

    // Update the SQL records with the rewritten values
    if (updatedRecords.length) {
      sqlUpsertEntries(database.id, updatedRecords);
    }
  }
}
