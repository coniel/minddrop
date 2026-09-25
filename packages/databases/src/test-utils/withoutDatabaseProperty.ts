import { Database } from '../types';

/**
 * Returns a copy of a database without the named property in its
 * schema.
 *
 * @param database - The database to copy.
 * @param propertyName - The name of the property to leave out.
 * @returns The database without the property.
 */
export function withoutDatabaseProperty(
  database: Database,
  propertyName: string,
): Database {
  return {
    // The database's own fields
    ...database,
    // The schema without the property
    properties: database.properties.filter(
      (property) => property.name !== propertyName,
    ),
  };
}
