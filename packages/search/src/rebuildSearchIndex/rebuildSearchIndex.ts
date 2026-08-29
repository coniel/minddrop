import MiniSearch from 'minisearch';
import { Databases } from '@minddrop/databases';
import { MINISEARCH_OPTIONS } from '../minisearchOptions';
import { persistIndex } from '../persistIndex';
import { searchIndexes } from '../searchIndexStore';
import type { SearchDocument } from '../types';
import { buildEntryDocument } from '../utils';

/**
 * Rebuilds the MiniSearch index from SQL data for the
 * specified workspace.
 *
 * @param workspaceId - The workspace to rebuild the index for.
 */
export async function rebuildSearchIndex(workspaceId: string): Promise<void> {
  const miniSearch = new MiniSearch<SearchDocument>(MINISEARCH_OPTIONS);
  const entries = Databases.sql.getAllEntries();

  // Build entry documents from SQL data
  const entryDocuments = entries.map((entry) =>
    buildEntryDocument(entry, {
      name: Databases.sql.getDatabaseName(entry.databaseId) ?? '',
      icon: Databases.sql.getDatabaseIcon(entry.databaseId),
    }),
  );

  // Build database documents
  const databases = Databases.sql.getAllDatabases();
  const databaseDocuments: SearchDocument[] = databases.map((database) => ({
    id: `db:${database.id}`,
    type: 'database' as const,
    title: database.name,
    databaseId: database.id,
    databaseName: database.name,
    databaseIcon: database.icon,
    content: '',
    properties: '',
    tags: '',
  }));

  // Bulk-add all documents
  miniSearch.addAll([...entryDocuments, ...databaseDocuments]);
  searchIndexes.set(workspaceId, miniSearch);

  // Persist to disk
  await persistIndex(workspaceId);
}
