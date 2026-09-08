export interface WorkspacesConfig {
  /**
   * Paths to the workspace directories on the file system.
   */
  paths: string[];

  /**
   * Path to the workspace directory the app opens into.
   */
  activePath?: string;
}
