import { Sql } from '@minddrop/sql';
import type { SqlParam } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import type { SqlEntryContentMatch } from '../../types';

// Maximum number of tokens in a match snippet
const SNIPPET_TOKENS = 12;

export interface SqlSearchEntryContentOptions {
  /**
   * The marker inserted before each matched word in a snippet.
   */
  highlightStart: string;

  /**
   * The marker inserted after each matched word in a snippet.
   */
  highlightEnd: string;

  /**
   * Maximum number of matches to return. Defaults to 20.
   */
  limit?: number;

  /**
   * The ID of the database to limit the search to.
   */
  databaseId?: string;
}

/**
 * Searches the text and content property values of entries for
 * every word of a query. Each word matches as a prefix.
 *
 * @param query - The search query.
 * @param options - The snippet highlight markers and search scope.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 * @returns The matching values, most relevant first.
 */
export function sqlSearchEntryContent(
  query: string,
  options: SqlSearchEntryContentOptions,
  workspaceId?: string,
): SqlEntryContentMatch[] {
  // Convert the query into an FTS5 expression. Query syntax in it
  // is read as literal text.
  const match = Sql.resolveFtsPrefixQuery(query);

  if (!match) {
    return [];
  }

  // Limit the search to the database if one is given
  const databaseFilter = options.databaseId
    ? 'AND entries.database_id = ?'
    : '';
  const databaseParams: SqlParam[] = options.databaseId
    ? [options.databaseId]
    : [];

  // Search the content index, ranked by BM25, with each match's entry
  // and database.
  return Sql.all<SqlEntryContentMatch>(
    workspaceId ?? Workspaces.getActive().id,
    `SELECT
       entry_content.entry_id AS entryId,
       entries.title AS entryTitle,
       entries.database_id AS databaseId,
       databases.name AS databaseName,
       databases.icon AS databaseIcon,
       entry_content.property_name AS propertyName,
       entry_content.property_type AS propertyType,
       snippet(entry_content, 3, ?, ?, '', ${SNIPPET_TOKENS}) AS snippet,
       bm25(entry_content) AS rank
     FROM entry_content
     JOIN entries ON entries.id = entry_content.entry_id
     JOIN databases ON databases.id = entries.database_id
     WHERE entry_content MATCH ? ${databaseFilter}
     ORDER BY rank
     LIMIT ?`,
    options.highlightStart,
    options.highlightEnd,
    match,
    ...databaseParams,
    options.limit ?? 20,
  );
}
