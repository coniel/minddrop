import { DatabasePropertyOptionRenamedEventData } from '../../events';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import { renameDatabaseEntriesPropertyOption } from '../../renameDatabaseEntriesPropertyOption';
import { sqlUpsertEntries } from '../../sql';
import { convertEntryToSqlRecord } from '../../utils';

/**
 * Called when a select property option is renamed. Rewrites the
 * option value in the entries which have it.
 */
export async function onRenamePropertyOption(
  data: DatabasePropertyOptionRenamedEventData,
): Promise<void> {
  const { updated: database, property, oldValue, newValue, action } = data;

  // Rewrite the option value in the entries which have it
  const entries = await renameDatabaseEntriesPropertyOption(
    database.id,
    property,
    oldValue,
    newValue,
  );

  // Update the SQL records with the rewritten values
  if (entries.length) {
    sqlUpsertEntries(
      database.id,
      entries.map((entry) => convertEntryToSqlRecord(entry, database)),
    );
  }

  // Record the rename against each of them
  await Promise.all(
    entries.map((entry) =>
      recordDatabaseEntryHistory(database, entry, {
        kind: 'rename',
        target: 'value-label',
        property: property.name,
        from: oldValue,
        to: newValue,
        action,
      }),
    ),
  );
}
