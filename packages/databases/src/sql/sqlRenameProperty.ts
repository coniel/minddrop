import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import { DatabasePropertySqlSyncedEvent } from '../events';
import type { DatabasePropertySqlSyncedEventData } from '../events';

/**
 * Renames a property across all entries in a database.
 * Updates both the entry_properties and entry_property_values
 * tables in a single transaction, then dispatches a
 * DatabasePropertySqlSyncedEvent.
 */
export function sqlRenameProperty(
  databaseId: string,
  oldName: string,
  newName: string,
): void {
  Sql.transaction([
    // Rename in the scalar properties table
    {
      sql: `UPDATE entry_properties SET property_name = ?
         WHERE property_name = ?
         AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)`,
      params: [newName, oldName, databaseId],
    },
    // Rename in the multi-value properties table
    {
      sql: `UPDATE entry_property_values SET property_name = ?
         WHERE property_name = ?
         AND entry_id IN (SELECT id FROM entries WHERE database_id = ?)`,
      params: [newName, oldName, databaseId],
    },
    // Increment the version counter
    {
      sql: "UPDATE meta SET value = CAST(CAST(value AS INTEGER) + 1 AS TEXT) WHERE key = 'version'",
      params: [],
    },
  ]);

  // Dispatch SQL synced event
  Events.dispatch<DatabasePropertySqlSyncedEventData>(
    DatabasePropertySqlSyncedEvent,
    {
      action: 'rename',
      databaseId,
      oldName,
      newName,
    },
  );
}
