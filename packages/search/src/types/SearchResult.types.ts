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
