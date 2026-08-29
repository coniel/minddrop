import { Databases } from '@minddrop/databases';
import type { SearchDocument } from '../types';

/**
 * Builds the search document for an entry from its SQL text
 * content and the owning database's metadata.
 *
 * @param entry - The entry to build the document for.
 * @param database - The owning database's name and icon.
 * @returns The entry's search document.
 */
export function buildEntryDocument(
  entry: { id: string; title: string; databaseId: string },
  database: { name: string; icon: string },
): SearchDocument {
  // Pull the entry's searchable text from SQL
  const { textValues, propertyValues } = Databases.sql.getEntryTextContent(
    entry.id,
  );

  return {
    id: entry.id,
    type: 'entry',
    title: entry.title,
    databaseId: entry.databaseId,
    databaseName: database.name,
    databaseIcon: database.icon,
    content: textValues.join(' '),
    properties: propertyValues.join(' '),
    tags: '',
  };
}
