export type FileSystemChangeKind = 'created' | 'modified' | 'deleted';

export interface FileSystemChange {
  /**
   * The ID of the workspace the changed path belongs to.
   */
  workspaceId: string;

  /**
   * The path of the file or directory that changed.
   */
  path: string;

  /**
   * The kind of change that occurred.
   */
  kind: FileSystemChangeKind;
}

export interface FileSystemWatchRoot {
  /**
   * The ID of the workspace whose directory is watched.
   */
  workspaceId: string;

  /**
   * The path of the workspace directory to watch.
   */
  path: string;
}
