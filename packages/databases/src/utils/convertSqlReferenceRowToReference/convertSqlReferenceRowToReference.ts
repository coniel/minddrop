import { EntryReference, SqlEntryReferenceRow } from '../../types';

/**
 * Converts a row of the SQL entry_references table to the reference it
 * stores.
 *
 * @param row - The row to convert.
 * @returns The reference.
 */
export function convertSqlReferenceRowToReference(
  row: SqlEntryReferenceRow,
): EntryReference {
  // Convert a property reference row
  if (row.kind === 'property') {
    return {
      kind: 'property',
      entryId: row.entry_id,
      propertyName: row.property_name ?? '',
      targetEntryId: row.target_entry_id ?? '',
    };
  }

  // Convert a wikilink row, leaving out a fragment it was written
  // without.
  return {
    kind: 'wikilink',
    entryId: row.entry_id,
    reference: row.target_reference ?? '',
    fragment: row.fragment ?? undefined,
  };
}
