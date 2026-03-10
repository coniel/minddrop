import type { QueryPropertyFilter, QueryPropertySort } from '@minddrop/queries';
import { compileQuery } from '@minddrop/search';
import type {
  FullTextSearchResult,
  SearchEntryData,
  StructuredSearchResult,
} from '@minddrop/search';
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
  searchFullText as searchFullTextIndex,
  upsertIndexDatabase,
  upsertIndexEntries,
} from './searchIndex';

/**
 * RPC handler for full-text fuzzy search via MiniSearch.
 */
export async function handleSearchFullText({
  workspaceId,
  query,
  limit,
  databaseId,
}: {
  workspaceId: string;
  query: string;
  limit?: number;
  databaseId?: string;
}): Promise<FullTextSearchResult[]> {
  return searchFullTextIndex(workspaceId, query, limit, databaseId);
}

/**
 * RPC handler for structured property-based queries via SQLite.
 */
export async function handleSearchStructured({
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
}): Promise<StructuredSearchResult> {
  const database = getSearchDb(workspaceId);

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
 * RPC handler for incremental sync after entry changes.
 * Updates both SQLite and MiniSearch.
 */
export async function handleSearchSync({
  workspaceId,
  action,
  entries,
  entryIds,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  entries?: SearchEntryData[];
  entryIds?: string[];
}): Promise<void> {
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
 * RPC handler for syncing database metadata (create/update/delete).
 * On upsert, also re-indexes all entry documents belonging to the
 * database so their stored databaseName/databaseIcon stay current.
 */
export async function handleSearchDatabaseSync({
  workspaceId,
  action,
  database,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  database: { id: string; name: string; path: string; icon: string };
}): Promise<void> {
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
 * RPC handler for re-indexing all entries in a database.
 * Used when the property schema changes (add/remove/rename).
 */
export async function handleSearchReindexDatabase({
  workspaceId,
  databaseId,
}: {
  workspaceId: string;
  databaseId: string;
}): Promise<void> {
  reindexDatabaseEntries(workspaceId, databaseId);
}

/**
 * RPC handler for renaming a property across all entries in
 * a database. Updates SQLite and re-indexes MiniSearch.
 */
export async function handleSearchRenameProperty({
  workspaceId,
  databaseId,
  oldName,
  newName,
}: {
  workspaceId: string;
  databaseId: string;
  oldName: string;
  newName: string;
}): Promise<void> {
  // Rename the property in SQLite
  renameProperty(workspaceId, databaseId, oldName, newName);

  // Re-index MiniSearch documents with the updated property data
  reindexDatabaseEntries(workspaceId, databaseId);
}
