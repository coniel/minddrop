export interface FsEntry {
  /**
   * The file's path.
   */
  path: string;

  /**
   * Name of the directory/file
   * can be null if the path terminates with `..`
   */
  name?: string;

  /**
   * Children of this entry if it's a directory;
   * null otherwise
   */
  children?: FsEntry[];
}
