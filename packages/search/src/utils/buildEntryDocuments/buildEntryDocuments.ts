import { Databases } from '@minddrop/databases';
import type { SearchDocument } from '../../types';
import { buildEntryDocument } from '../buildEntryDocument';

/**
 * Builds the search documents for entries.
 *
 * @param workspaceId - The ID of the workspace the entries belong to.
 * @param entries - The entries to build documents for.
 * @param propertyValues - The entries' short property values, keyed by entry ID.
 * @returns The entries' search documents, in order.
 */
export function buildEntryDocuments(
  workspaceId: string,
  entries: { id: string; title: string; databaseId: string }[],
  propertyValues: Map<string, string[]>,
): SearchDocument[] {
  // Read the databases' metadata, keyed by ID
  const databases = new Map(
    Databases.sql
      .getAllDatabases(workspaceId)
      .map((database) => [database.id, database]),
  );

  // Build each entry's document
  return entries.map((entry) => {
    const database = databases.get(entry.databaseId);

    return buildEntryDocument(
      entry,
      { name: database?.name ?? '', icon: database?.icon ?? '' },
      propertyValues.get(entry.id) ?? [],
    );
  });
}
