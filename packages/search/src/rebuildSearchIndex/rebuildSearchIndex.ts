import MiniSearch from 'minisearch';
import { Databases } from '@minddrop/databases';
import { MINISEARCH_OPTIONS } from '../minisearchOptions';
import { searchIndexes } from '../searchIndexStore';
import type { SearchDocument } from '../types';
import { buildDatabaseDocument, buildEntryDocuments } from '../utils';

/**
 * Rebuilds the MiniSearch index from SQL data for the
 * specified workspace.
 *
 * @param workspaceId - The ID of the workspace to rebuild the index for.
 */
export function rebuildSearchIndex(workspaceId: string): void {
  // Create an empty index
  const miniSearch = new MiniSearch<SearchDocument>(MINISEARCH_OPTIONS);

  // Build entry documents from every entry's SQL data
  const entryDocuments = buildEntryDocuments(
    workspaceId,
    Databases.sql.getEntrySummaries({}, workspaceId),
    Databases.sql.getEntryShortPropertyValues({}, workspaceId),
  );

  // Build database documents
  const databaseDocuments = Databases.sql
    .getAllDatabases(workspaceId)
    .map(buildDatabaseDocument);

  // Add all documents
  miniSearch.addAll([...entryDocuments, ...databaseDocuments]);

  // Store the workspace's index
  searchIndexes.set(workspaceId, miniSearch);
}
