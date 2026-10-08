import type { SearchDocument } from '../../types';

/**
 * Builds the search document for a database.
 *
 * @param database - The database's ID, name and icon.
 * @returns The database's search document.
 */
export function buildDatabaseDocument(database: {
  id: string;
  name: string;
  icon?: string;
}): SearchDocument {
  return {
    id: `db:${database.id}`,
    type: 'database',
    title: database.name,
    databaseId: database.id,
    databaseName: database.name,
    databaseIcon: database.icon || '',
    properties: '',
    tags: '',
  };
}
