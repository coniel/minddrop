import type { SearchDocument } from '../types';

/**
 * Builds the search document for an entry from its short property
 * values and the owning database's metadata.
 *
 * @param entry - The entry to build the document for.
 * @param database - The owning database's name and icon.
 * @param propertyValues - The entry's short property values.
 * @returns The entry's search document.
 */
export function buildEntryDocument(
  entry: { id: string; title: string; databaseId: string },
  database: { name: string; icon: string },
  propertyValues: string[],
): SearchDocument {
  return {
    id: entry.id,
    type: 'entry',
    title: entry.title,
    databaseId: entry.databaseId,
    databaseName: database.name,
    databaseIcon: database.icon,
    properties: propertyValues.join(' '),
    tags: '',
  };
}
