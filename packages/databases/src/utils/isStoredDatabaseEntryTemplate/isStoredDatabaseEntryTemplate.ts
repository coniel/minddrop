import { StoredDatabaseEntryTemplate } from '../../types';

/**
 * Checks whether a parsed value has the fields identifying a stored
 * entry template.
 *
 * @param value - The value to check.
 * @returns True if the value has a string ID and name, and a properties object.
 */
export function isStoredDatabaseEntryTemplate(
  value: unknown,
): value is StoredDatabaseEntryTemplate {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'properties' in value &&
    typeof value.properties === 'object' &&
    value.properties !== null
  );
}
