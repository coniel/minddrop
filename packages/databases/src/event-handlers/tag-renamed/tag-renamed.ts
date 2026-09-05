import { History } from '@minddrop/history';
import { TagRenamedEventData } from '@minddrop/tags';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { getAllDatabases } from '../../getAllDatabases';
import { sqlUpsertEntries } from '../../sql';
import { DatabaseEntry, SqlEntryRecord } from '../../types';
import { convertEntryToSqlRecord } from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Called when a tag is renamed. Rewrites the old tag name to the
 * new one in the tags property values of every entry referencing
 * it, persisting the entries to disk and SQL.
 */
export async function onTagRenamed(data: TagRenamedEventData): Promise<void> {
  const { original, updated } = data;

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
      // Rewrite the entry's tags values
      const rewritten = renameEntryTag(
        entry,
        tagsPropertyNames,
        original.name,
        updated.name,
      );

      // Skip entries which do not reference the renamed tag
      if (!rewritten) {
        continue;
      }

      // Update the entry in the store
      DatabaseEntriesStore.update(entry.id, rewritten.entry);

      // Write the updated entry to the file system
      await writeDatabaseEntry(entry.id);

      // Record the rename against each property which held the tag
      await Promise.all(
        rewritten.properties.map((property) =>
          History.record({
            ownerPath: database.path,
            subjectKey: entry.title,
            kind: 'rename',
            target: 'value-label',
            property,
            from: original.name,
            to: updated.name,
          }),
        ),
      );

      // Queue the entry's SQL record for the batch upsert
      updatedRecords.push(convertEntryToSqlRecord(rewritten.entry, database));
    }

    // Update the SQL records with the rewritten values
    if (updatedRecords.length) {
      sqlUpsertEntries(database.id, updatedRecords);
    }
  }
}

/**
 * Returns a copy of the entry with the old tag name mapped to the
 * new one in its tags property values, alongside the properties
 * which held it, or null when no value references the old name.
 */
function renameEntryTag(
  entry: DatabaseEntry,
  tagsPropertyNames: string[],
  oldName: string,
  newName: string,
): { entry: DatabaseEntry; properties: string[] } | null {
  const changedProperties: string[] = [];
  const properties = { ...entry.properties };

  for (const propertyName of tagsPropertyNames) {
    const value = properties[propertyName];

    // Skip values which do not reference the old name
    if (!Array.isArray(value) || !value.includes(oldName)) {
      continue;
    }

    // Map the old name to the new one, deduping in case the new
    // name was already present
    const renamed = value.map((name) => (name === oldName ? newName : name));
    properties[propertyName] = [...new Set(renamed)];
    changedProperties.push(propertyName);
  }

  // Check whether any of the entry's properties held the tag
  if (!changedProperties.length) {
    return null;
  }

  return { entry: { ...entry, properties }, properties: changedProperties };
}
