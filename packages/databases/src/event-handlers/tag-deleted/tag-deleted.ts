import { TagDeletedEventData } from '@minddrop/tags';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { getAllDatabases } from '../../getAllDatabases';
import { sqlUpsertEntries } from '../../sql';
import { DatabaseEntry, SqlEntryRecord } from '../../types';
import { convertEntryToSqlRecord } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Called when a tag is deleted. Removes the tag's name from the
 * tags property values of every entry referencing it, persisting
 * the entries to disk and SQL.
 */
export async function onTagDeleted(data: TagDeletedEventData): Promise<void> {
  // Rewrite matching entries database by database
  for (const database of getAllDatabases()) {
    // The names of the database's tags properties
    const tagsPropertyNames = database.properties
      .filter((property) => property.type === 'tags')
      .map((property) => property.name);

    // Skip databases without tags properties
    if (tagsPropertyNames.length === 0) {
      continue;
    }

    // The rewritten entries' SQL records, upserted as a batch
    const updatedRecords: SqlEntryRecord[] = [];

    for (const entry of getAllDatabaseEntries(database.id)) {
      // Remove the deleted tag from the entry's tags values
      const updatedEntry = removeEntryTag(entry, tagsPropertyNames, data.name);

      // Skip entries which do not reference the deleted tag
      if (!updatedEntry) {
        continue;
      }

      // Update the entry in the store
      DatabaseEntriesStore.update(entry.id, updatedEntry);

      // Write the updated entry to the file system
      await writeDatabaseEntry(entry.id);

      // Queue the entry's SQL record for the batch upsert
      updatedRecords.push(convertEntryToSqlRecord(updatedEntry, database));
    }

    // Update the SQL records with the rewritten values
    if (updatedRecords.length) {
      sqlUpsertEntries(database.id, updatedRecords);
    }
  }
}

/**
 * Returns a copy of the entry with the deleted tag name removed
 * from its tags property values, or null when no value references
 * the name.
 */
function removeEntryTag(
  entry: DatabaseEntry,
  tagsPropertyNames: string[],
  deletedName: string,
): DatabaseEntry | null {
  let changed = false;
  const properties = { ...entry.properties };

  for (const propertyName of tagsPropertyNames) {
    const value = properties[propertyName];

    // Skip values which do not reference the deleted name
    if (!Array.isArray(value) || !value.includes(deletedName)) {
      continue;
    }

    // Remove the deleted name from the value
    properties[propertyName] = value.filter((name) => name !== deletedName);
    changed = true;
  }

  return changed ? { ...entry, properties } : null;
}
