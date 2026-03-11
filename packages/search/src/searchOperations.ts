import type { Database } from '@minddrop/databases';
import type { QueryPropertyFilter, QueryPropertySort } from '@minddrop/queries';
import { compileQuery } from './compileQuery';
import { initializeSearchData } from './initializeSearchData';
import {
  deleteDatabase as deleteDbRecord,
  deleteEntries,
  getSearchDb,
  renameProperty,
  upsertDatabase as upsertDbRecord,
  upsertEntries,
} from './searchDb';
import {
  reindexDatabaseEntries,
  removeIndexDatabase,
  removeIndexEntries,
  searchFullTextIndex,
  upsertIndexDatabase,
  upsertIndexEntries,
} from './searchIndex';
import type {
  FullTextSearchResult,
  SearchEntryData,
  SqliteDatabase,
  StructuredSearchResult,
} from './types';

/**
 * Back-end only. Initializes the search system for a
 * workspace. Receives database metadata from the frontend,
 * reads entries from disk.
 */
export async function handleSearchInitialize({
  workspaceId,
  databases,
}: {
  workspaceId: string;
  databases: Database[];
}): Promise<void> {
  await initializeSearchData(workspaceId, databases);
}

/**
 * Back-end only. Performs a full-text fuzzy search via
 * MiniSearch.
 */
export function handleSearchFullText({
  workspaceId,
  query,
  limit,
  databaseId,
}: {
  workspaceId: string;
  query: string;
  limit?: number;
  databaseId?: string;
}): FullTextSearchResult[] {
  return searchFullTextIndex(workspaceId, query, limit, databaseId);
}

/**
 * Back-end only. Performs a structured property-based query
 * via SQLite.
 */
export function handleSearchStructured({
  workspaceId,
  databaseId,
  filters,
  sort,
  limit,
  offset,
}: {
  workspaceId: string;
  databaseId?: string;
  filters: QueryPropertyFilter[];
  sort: QueryPropertySort[];
  limit?: number;
  offset?: number;
}): StructuredSearchResult {
  const database: SqliteDatabase = getSearchDb(workspaceId);

  // Compile the query filters and sorts into SQL
  const compiled = compileQuery(filters, sort, {
    databaseId,
    limit,
    offset,
  });

  // Execute the main query
  const rows = database.prepare(compiled.sql).all(...compiled.params) as {
    id: string;
    database_id: string;
    path: string;
    title: string;
    created: number;
    last_modified: number;
  }[];

  // Execute the count query
  const countRow = database
    .prepare(compiled.countSql)
    .get(...compiled.countParams) as { total: number };

  return {
    entries: rows.map((row) => ({
      id: row.id,
      databaseId: row.database_id,
      path: row.path,
      title: row.title,
      created: row.created,
      lastModified: row.last_modified,
    })),
    total: countRow.total,
  };
}

/**
 * Back-end only. Handles incremental sync after entry
 * changes. Updates both SQLite and MiniSearch.
 */
export function handleSearchSync({
  workspaceId,
  action,
  entries,
  entryIds,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  entries?: SearchEntryData[];
  entryIds?: string[];
}): void {
  if (action === 'upsert' && entries?.length) {
    // Update SQLite
    upsertEntries(workspaceId, entries);

    // Update MiniSearch
    upsertIndexEntries(
      workspaceId,
      entries.map((entry) => ({
        id: entry.id,
        title: entry.title,
        databaseId: entry.databaseId,
      })),
    );
  }

  if (action === 'delete' && entryIds?.length) {
    // Update SQLite (CASCADE handles property cleanup)
    deleteEntries(workspaceId, entryIds);

    // Update MiniSearch
    removeIndexEntries(workspaceId, entryIds);
  }
}

/**
 * Back-end only. Handles syncing database metadata
 * (create/update/delete). On upsert, also re-indexes all
 * entry documents belonging to the database so their stored
 * databaseName/databaseIcon stay current.
 */
export function handleSearchDatabaseSync({
  workspaceId,
  action,
  database,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  database: { id: string; name: string; path: string; icon: string };
}): void {
  if (action === 'upsert') {
    upsertDbRecord(workspaceId, database);
    upsertIndexDatabase(workspaceId, database);

    // Re-index entry documents so databaseName/databaseIcon
    // are up to date
    reindexDatabaseEntries(workspaceId, database.id);
  }

  if (action === 'delete') {
    deleteDbRecord(workspaceId, database.id);
    removeIndexDatabase(workspaceId, database.id);
  }
}

/**
 * Back-end only. Re-indexes all entries in a database.
 * Used when the property schema changes (add/remove/rename).
 */
export function handleSearchReindexDatabase({
  workspaceId,
  databaseId,
}: {
  workspaceId: string;
  databaseId: string;
}): void {
  reindexDatabaseEntries(workspaceId, databaseId);
}

/**
 * Back-end only. Renames a property across all entries in a
 * database. Updates SQLite and re-indexes MiniSearch.
 */
export function handleSearchRenameProperty({
  workspaceId,
  databaseId,
  oldName,
  newName,
}: {
  workspaceId: string;
  databaseId: string;
  oldName: string;
  newName: string;
}): void {
  // Rename the property in SQLite
  renameProperty(workspaceId, databaseId, oldName, newName);

  // Re-index MiniSearch documents with the updated property data
  reindexDatabaseEntries(workspaceId, databaseId);
}
