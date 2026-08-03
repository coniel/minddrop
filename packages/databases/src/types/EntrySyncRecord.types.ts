/**
 * The subset of a SQL entry record used to diff entries
 * during background sync.
 */
export interface EntrySyncRecord {
  /**
   * The unique entry ID.
   */
  id: string;

  /**
   * Absolute path to the entry's primary file.
   */
  path: string;

  /**
   * The date the entry was last modified, as epoch milliseconds.
   */
  lastModified: number;
}
