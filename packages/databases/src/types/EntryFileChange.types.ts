/**
 * A change to one entry's files made outside of the app, as reported
 * by the file system watcher.
 */
export interface EntryFileChange {
  /**
   * The ID of the database the entry belongs to.
   */
  databaseId: string;

  /**
   * Path to the entry's primary file, relative to its database
   * directory.
   */
  path: string;

  /**
   * Which of the entry's files changed: its primary file, or its
   * metadata sidecar.
   */
  file: 'entry' | 'metadata';
}
