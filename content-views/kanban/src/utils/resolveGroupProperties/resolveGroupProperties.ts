import { Database } from '@minddrop/databases';
import { SelectPropertySchema } from '@minddrop/properties';

/**
 * Lists the select properties a database's entries can be
 * grouped into columns by.
 *
 * @param database - The database the entries belong to, null while it has not loaded.
 * @returns The select properties the entries can be grouped by.
 */
export function resolveGroupProperties(
  database: Database | null,
): SelectPropertySchema[] {
  // Check if the database has loaded. If not, there are no
  // properties to list.
  if (!database) {
    return [];
  }

  // Filter for the database's select properties
  return database.properties.filter(
    (property): property is SelectPropertySchema => property.type === 'select',
  );
}
