/**
 * View mode for the file content area.
 */
export type ViewMode = 'diff' | 'original' | 'current';

/**
 * Git change status for a file.
 */
export type FileStatus = 'added' | 'modified' | 'deleted';

/**
 * A request to scroll a line of the current file into view.
 */
export interface RevealRequest {
  /**
   * The line to reveal.
   */
  line: number;

  /**
   * Unique token so repeated requests for the same line are applied.
   */
  token: number;
}

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

  /**
   * Name of the agent worktree holding the file's changes, or null
   * for the main checkout.
   */
  worktree: string | null;
}
