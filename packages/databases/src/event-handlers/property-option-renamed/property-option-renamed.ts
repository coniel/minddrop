import { DatabasePropertyOptionRenamedEventData } from '../../events';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import { recordDatabaseHistory } from '../../recordDatabaseHistory';
import { renameDatabaseEntriesPropertyOption } from '../../renameDatabaseEntriesPropertyOption';
import { sqlUpsertEntries } from '../../sql';
import { convertEntryToSqlRecord } from '../../utils';

/**
 * Called when a select property option is renamed. Applies the
 * rename to everything holding the old value.
 *
 * @param data - The renamed option's event data.
 */
export async function onRenamePropertyOption(
  data: DatabasePropertyOptionRenamedEventData,
): Promise<void> {
  const { updated: database, property, oldValue, newValue, action } = data;

  // Record the rename against the database's history
  await recordDatabaseHistory(database, {
    kind: 'rename',
    target: 'value-label',
    property: property.name,
    from: oldValue,
    to: newValue,
    action,
  });

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
