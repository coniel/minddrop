export interface Workspace {
  /**
   * The absolute path to the workspace directory.
   */
  path: string;

  /**
   * Whether the workspace directory exists at the specified path.
   */
  exists: boolean;

  /**
   * The workspace name (same as workspace directory name).
   */
  name: string;
}
