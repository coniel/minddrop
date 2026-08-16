export type FileSystemChangeKind = 'created' | 'modified' | 'deleted';

export interface FileSystemChange {
  /**
   * The path of the file or directory that changed.
   */
  path: string;

  /**
   * The kind of change that occurred.
   */
  kind: FileSystemChangeKind;
}
