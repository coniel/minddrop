import { RPCSchema } from 'electrobun';

/**
 * A change manifest representing a group of related file changes.
 */
export interface Manifest {
  /**
   * Human-readable title for the work group.
   */
  title: string;

  /**
   * The git commit hash at the time work began.
   */
  baseRef: string;

  /**
   * Name of the agent worktree the changes live in. Absent when
   * the work happened in the main checkout.
   */
  worktree?: string;

  /**
   * Repo-relative paths of changed files.
   */
  files: string[];
}

/**
 * A manifest with its slug identifier attached.
 */
export interface ManifestWithSlug extends Manifest {
  /**
   * The kebab-case slug used as the manifest filename.
   */
  slug: string;
}

/**
 * A changed file not listed in any manifest, with the diff context
 * needed to open it.
 */
export interface UntrackedChange {
  /**
   * Repo-relative path of the changed file.
   */
  path: string;

  /**
   * Name of the agent worktree the change lives in, or null for the
   * main checkout.
   */
  worktree: string | null;

  /**
   * The git ref the file is diffed against: the worktree branch's
   * merge base with main, or HEAD for the main checkout.
   */
  baseRef: string;
}

/**
 * Whether a review comment still needs addressing.
 */
export type ReviewCommentStatus = 'open' | 'resolved';

/**
 * A review comment on a work group, either anchored to a line range
 * of a file or general to the whole work group.
 */
export interface ReviewComment {
  /**
   * Unique id, also the comment's filename stem.
   */
  id: string;

  /**
   * Repo-relative path of the commented file, or null for a general
   * comment.
   */
  file: string | null;

  /**
   * First line of the commented range in the current file content,
   * or null for a general comment.
   */
  startLine: number | null;

  /**
   * Last line of the commented range, or null for a general comment.
   */
  endLine: number | null;

  /**
   * The code that was selected when the comment was written, or null
   * for a general comment.
   */
  snippet: string | null;

  /**
   * Whether the comment is open or resolved.
   */
  status: ReviewCommentStatus;

  /**
   * ISO date string of when the comment was written.
   */
  created: string;

  /**
   * The comment text.
   */
  text: string;
}

/**
 * The fields needed to create a review comment.
 */
export type NewReviewComment = Pick<
  ReviewComment,
  'file' | 'startLine' | 'endLine' | 'snippet' | 'text'
>;

/**
 * The fields of a review comment which can be changed after creation.
 */
export type ReviewCommentChanges = Partial<
  Pick<ReviewComment, 'status' | 'text'>
>;

/**
 * RPC schema for communication between the Bun backend and
 * the webview renderer.
 */
export type DevReviewRPC = {
  bun: RPCSchema<{
    requests: {
      /**
       * Returns all active manifests.
       */
      getManifests: {
        params: Record<string, never>;
        response: ManifestWithSlug[];
      };

      /**
       * Returns file content at a specific git ref.
       */
      getFileContent: {
        params: { ref: string; path: string };
        response: string;
      };

      /**
       * Returns the current file content from disk, read from the
       * given worktree or the main checkout.
       */
      getCurrentFileContent: {
        params: { path: string; worktree: string | null };
        response: string;
      };

      /**
       * Returns files changed in the main checkout or any agent worktree
       * that aren't listed in a manifest for that checkout.
       */
      getUntrackedChanges: {
        params: Record<string, never>;
        response: UntrackedChange[];
      };

      /**
       * Returns the git status (added, modified, deleted) for each
       * changed file relative to a base ref, diffed in the given
       * worktree or the main checkout.
       */
      getFileStatuses: {
        params: { baseRef: string; worktree: string | null };
        response: Record<string, 'added' | 'modified' | 'deleted'>;
      };

      /**
       * Deletes a manifest file by slug.
       */
      deleteManifest: {
        params: { slug: string };
        response: void;
      };

      /**
       * Returns the reviewed file paths of every work group, keyed by
       * slug. Files changed since they were reviewed are left out.
       */
      getReviewedFiles: {
        params: Record<string, never>;
        response: Record<string, string[]>;
      };

      /**
       * Records or clears a file's reviewed state in a work group.
       */
      setFileReviewed: {
        params: { slug: string; path: string; reviewed: boolean };
        response: void;
      };

      /**
       * Returns the number of open comments on each file, keyed by
       * work group slug and then by file path.
       */
      getOpenCommentCounts: {
        params: Record<string, never>;
        response: Record<string, Record<string, number>>;
      };

      /**
       * Returns all review comments for a work group.
       */
      getReviewComments: {
        params: { slug: string };
        response: ReviewComment[];
      };

      /**
       * Writes a new review comment file for a work group.
       */
      createReviewComment: {
        params: { slug: string; comment: NewReviewComment };
        response: ReviewComment;
      };

      /**
       * Rewrites a review comment file with the given changes.
       */
      updateReviewComment: {
        params: { slug: string; id: string; changes: ReviewCommentChanges };
        response: void;
      };

      /**
       * Deletes a review comment file.
       */
      deleteReviewComment: {
        params: { slug: string; id: string };
        response: void;
      };
    };
  }>;
  webview: RPCSchema<{
    messages: {
      /**
       * Sent when manifests have changed on disk.
       */
      manifestsChanged: Record<string, never>;

      /**
       * Sent when review comment files have changed on disk.
       */
      reviewCommentsChanged: Record<string, never>;
    };
  }>;
};
