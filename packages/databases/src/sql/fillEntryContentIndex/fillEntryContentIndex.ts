import { Sql } from '@minddrop/sql';
import { yieldToTaskQueue } from '@minddrop/utils';
import { EntryContentPendingMetaKey } from '../../constants';

// Number of entry property rows indexed per chunk
const CHUNK_SIZE = 5000;

/**
 * Fills the entry content index if it is pending.
 *
 * Stops early if the workspace's connection closes. The index then
 * stays pending.
 *
 * @param workspaceId - The ID of the workspace whose index to fill.
 */
export async function fillEntryContentIndex(
  workspaceId: string,
): Promise<void> {
  // Check whether the content index is pending
  const pending = Sql.get(
    workspaceId,
    'SELECT value FROM meta WHERE key = ?',
    EntryContentPendingMetaKey,
  );

  if (!pending) {
    return;
  }

  // Get the last entry property row to index. Rows added later are
  // indexed by the content triggers.
  const lastRowid =
    Sql.get<{ lastRowid: number }>(
      workspaceId,
      'SELECT coalesce(max(rowid), 0) AS lastRowid FROM entry_properties',
    )?.lastRowid ?? 0;

  // Index the entry property rows in chunks
  for (let start = 0; start < lastRowid; start += CHUNK_SIZE) {
    // Index the chunk's text and content values
    Sql.transaction(workspaceId, [
      // Add an index row for each value without one
      {
        sql: `INSERT OR IGNORE INTO entry_content_rows (entry_id, property_name)
              SELECT entry_id, property_name FROM entry_properties
              WHERE rowid > ? AND rowid <= ?
                AND property_type IN ('text', 'content')
                AND value_text IS NOT NULL`,
        params: [start, start + CHUNK_SIZE],
      },
      // Index each value whose row has no index entry yet
      {
        sql: `INSERT INTO entry_content (rowid, entry_id, property_name, property_type, value)
              SELECT content_rows.id, properties.entry_id, properties.property_name,
                     properties.property_type, properties.value_text
              FROM entry_properties AS properties
              JOIN entry_content_rows AS content_rows
                ON content_rows.entry_id = properties.entry_id
               AND content_rows.property_name = properties.property_name
              WHERE properties.rowid > ? AND properties.rowid <= ?
                AND properties.property_type IN ('text', 'content')
                AND properties.value_text IS NOT NULL
                AND NOT EXISTS (
                  SELECT 1 FROM entry_content WHERE rowid = content_rows.id
                )`,
        params: [start, start + CHUNK_SIZE],
      },
    ]);

    // Yield to the event loop between chunks
    await yieldToTaskQueue();

    // Stop if the workspace's connection closed in the meantime. The
    // index stays pending.
    if (!Sql.isOpen(workspaceId)) {
      return;
    }
  }

  // Mark the content index as filled
  Sql.run(
    workspaceId,
    'DELETE FROM meta WHERE key = ?',
    EntryContentPendingMetaKey,
  );
}
