/**
 * The type of a full-text search result.
 */
export type FullTextSearchResultType = 'entry' | 'database';

/**
 * A result from a full-text fuzzy search via MiniSearch.
 */
export interface FullTextSearchResult {
  /**
   * The result ID (entry ID or database ID).
   */
  id: string;

  /**
   * Whether this result is an entry or a database.
   */
  type: FullTextSearchResultType;

  /**
   * The ID of the database the entry belongs to.
   * For database results, this is the database's own ID.
   */
  databaseId: string;

  /**
   * The name of the database the entry belongs to.
   * For database results, this is the database's own name.
   */
  databaseName: string;

  /**
   * The icon of the database the entry belongs to.
   * For database results, this is the database's own icon.
   */
  databaseIcon: string;

  /**
   * The result title.
   */
  title: string;

  /**
   * The relevance score from MiniSearch.
   */
  score: number;

  /**
   * Properties whose values matched the search query.
   * Only populated for entry results where the match was
   * on a property rather than (or in addition to) the title.
   */
  matchedProperties: FullTextMatchedProperty[];
}

/**
 * A property that matched the search query.
 */
export interface FullTextMatchedProperty {
  /**
   * The property name (e.g. "Author").
   */
  name: string;

  /**
   * The property type (e.g. "text", "url", "select").
   */
  type: string;

  /**
   * The matched property value (e.g. "Stephen King").
   */
  value: string;
}

/**
 * A result from a structured property-based query via SQLite.
 */
export interface StructuredSearchResult {
  /**
   * The matching entry IDs, in sort order.
   */
  entries: StructuredSearchEntry[];

  /**
   * The total number of matching entries (before pagination).
   */
  total: number;
}

/**
 * A single entry in a structured search result.
 */
export interface StructuredSearchEntry {
  /**
   * The entry ID.
   */
  id: string;

  /**
   * The ID of the database the entry belongs to.
   */
  databaseId: string;

  /**
   * Absolute path to the entry's primary file.
   */
  path: string;

  /**
   * The entry title.
   */
  title: string;

  /**
   * The date the entry was created, as epoch milliseconds.
   */
  created: number;

  /**
   * The date the entry was last modified, as epoch milliseconds.
   */
  lastModified: number;
}

/**
 * The output of the query-to-SQL compiler.
 */
export interface CompiledQuery {
  /**
   * The parameterized SQL query string.
   */
  sql: string;

  /**
   * The parameter values for the SQL query.
   */
  params: (string | number)[];

  /**
   * The parameterized SQL for counting total results
   * (without LIMIT/OFFSET).
   */
  countSql: string;

  /**
   * The parameter values for the count query.
   */
  countParams: (string | number)[];
}
