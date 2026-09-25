import { History } from '@minddrop/history';
import { Properties } from '@minddrop/properties';
import { TagRenamedEventData } from '@minddrop/tags';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { EntryHistorySubjectType } from '../../constants';
import { getAllDatabaseEntries } from '../../getAllDatabaseEntries';
import { getAllDatabases } from '../../getAllDatabases';
import { sqlUpsertEntries } from '../../sql';
import { SqlEntryRecord } from '../../types';
import {
  convertEntryToSqlRecord,
  resolveDatabasePath,
  rewriteEntryPropertyValues,
} from '../../utils';
import { writeDatabaseEntry } from '../../writeDatabaseEntry';

/**
 * Called when a tag is renamed. Rewrites the old tag name to the
 * new one in the tags property values of every entry referencing
 * it, persisting the entries to disk and SQL.
 */
export async function onTagRenamed(data: TagRenamedEventData): Promise<void> {
  const { original, updated, action } = data;

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

    for (const entry of getAllDatabaseEntries(database.id)) {
      // Rename the tag in the entry's tags values
      const rewritten = rewriteEntryPropertyValues(
        entry,
        tagsPropertyNames,
        (value) => Properties.renameValue(value, original.name, updated.name),
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
        rewritten.changes.map((change) =>
          History.record({
            ownerPath: resolveDatabasePath(database),
            subjectType: EntryHistorySubjectType,
            subjectKey: entry.title,
            kind: 'rename',
            target: 'value-label',
            property: change.property,
            from: original.name,
            to: updated.name,
            action,
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
