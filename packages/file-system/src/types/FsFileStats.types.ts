export interface FsFileStats {
  /**
   * The date the file was created.
   */
  created: Date;

  /**
   * The date the file was last modified.
   */
  lastModified: Date;

  /**
   * The file's size in bytes.
   */
  size: number;
}
