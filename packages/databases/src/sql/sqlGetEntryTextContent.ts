import { Sql } from '@minddrop/sql';
import { EXCLUDED_TYPES_SQL } from '../constants';

/**
 * Retrieves all text content for a given entry, used for
 * building the MiniSearch full-text index.
 */
export function sqlGetEntryTextContent(entryId: string): {
  textValues: string[];
  propertyValues: string[];
} {
  // Get text properties (for the "content" field)
  const textRows = Sql.all<{ value_text: string | null }>(
    "SELECT value_text FROM entry_properties WHERE entry_id = ? AND property_type IN ('text', 'formatted-text')",
    entryId,
  );

  // Get other scalar property values (for the "properties" field).
  // Excluded property types are not part of the full-text index.
  const propertyRows = Sql.all<{ value_text: string | null }>(
    `SELECT value_text FROM entry_properties WHERE entry_id = ? AND property_type NOT IN ('text', 'formatted-text', ${EXCLUDED_TYPES_SQL})`,
    entryId,
  );

  // Get multi-value property values (select options, collection
  // references) for the full-text index
  const multiValueRows = Sql.all<{ value_text: string }>(
    'SELECT value_text FROM entry_property_values WHERE entry_id = ?',
    entryId,
  );

  const textValues = textRows
    .map((row) => row.value_text)
    .filter((value): value is string => value !== null);

  const propertyValues = [
    ...propertyRows
      .map((row) => row.value_text)
      .filter((value): value is string => value !== null),
    ...multiValueRows.map((row) => row.value_text),
  ];

  return { textValues, propertyValues };
}
