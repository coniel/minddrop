export interface Workspace {
  /**
   * A unique identifier for the workspace.
   */
  id: string;

  /**
   * Path to the workspace directory on the file system.
   */
  path: string;

  /**
   * User specified name for the workspace.
   */
  name: string;

  /**
   * The workspace icon. Value depends on the icon type:
   * - `content-icon`: '[set-name]:[icon-name]:[color]'
   * - `emoji`: 'emoji:[emoji-character]:[skin-tone]'
   * - `image`: 'image:[image-file-name]'
   */
  icon: string;

  /**
   * The date the workspace was created.
   */
  created: Date;

  /**
   * The date the workspace config was last modified.
   */
  lastModified: Date;
}
