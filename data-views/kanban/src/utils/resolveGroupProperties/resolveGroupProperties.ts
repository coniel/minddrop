import { Database } from '@minddrop/databases';
import { SelectPropertySchema } from '@minddrop/properties';

/**
 * Lists the select properties a set of databases' entries can be
 * grouped into columns by. Only the first database's properties
 * are listed, so a board spanning several databases groups by one
 * of them and hides the rest of the entries.
 *
 * @param databases - The databases the entries belong to.
 * @returns The select properties the entries can be grouped by.
 */
export function resolveGroupProperties(
  databases: Database[],
): SelectPropertySchema[] {
  // The database the properties are taken from
  const [database] = databases;

  // Check if a database has loaded. If not, there are no
  // properties to list.
  if (!database) {
    return [];
  }

  // Filter for the database's select properties
  return database.properties.filter(
    (property): property is SelectPropertySchema => property.type === 'select',
  );
}
