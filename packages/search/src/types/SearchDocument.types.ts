/**
 * A document in the MiniSearch full-text index. Entries and
 * databases are both indexed as documents, discriminated by
 * `type`. Database document IDs are prefixed with `db:` to
 * avoid colliding with entry IDs.
 */
export interface SearchDocument {
  /**
   * The document ID (entry ID, or `db:` prefixed database ID).
   */
  id: string;

  /**
   * Whether the document is an entry or a database.
   */
  type: 'entry' | 'database';

  /**
   * The entry or database title.
   */
  title: string;

  /**
   * The ID of the database the entry belongs to.
   * For database documents, the database's own ID.
   */
  databaseId: string;

  /**
   * The name of the database the entry belongs to.
   * For database documents, the database's own name.
   */
  databaseName: string;

  /**
   * The icon of the database the entry belongs to.
   * For database documents, the database's own icon.
   */
  databaseIcon: string;

  /**
   * The entry's searchable text content. Empty for
   * database documents.
   */
  content: string;

  /**
   * The entry's searchable property values joined into a
   * single string. Empty for database documents.
   */
  properties: string;

  /**
   * The entry's tags. Empty for database documents.
   */
  tags: string;
}

/**
 * The SearchDocument fields stored alongside the MiniSearch
 * index and returned on search results. Must match the
 * `storeFields` list in the MiniSearch options.
 */
export type StoredSearchFields = Pick<
  SearchDocument,
  'type' | 'databaseId' | 'databaseName' | 'databaseIcon' | 'title'
>;
