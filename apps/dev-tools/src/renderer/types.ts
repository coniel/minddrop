/**
 * View mode for the file content area.
 */
export type ViewMode = 'diff' | 'original' | 'current';

/**
 * Represents a currently selected file for viewing.
 */
/**
 * A plan file entry from dev/plans/.
 */
export interface Plan {
  /**
   * Human-readable display name.
   */
  name: string;

  /**
   * The plan's filename on disk.
   */
  filename: string;
}

export interface SelectedFile {
  /**
   * Repo-relative file path.
   */
  path: string;

  /**
   * The manifest slug this file belongs to, or null for untracked files.
   */
  manifestSlug: string | null;

  /**
   * The base ref to diff against.
   */
  baseRef: string;
}
