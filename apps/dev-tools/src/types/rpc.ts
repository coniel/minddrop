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
       * Returns files changed in git that aren't listed in any manifest.
       */
      getUntrackedChanges: {
        params: Record<string, never>;
        response: string[];
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
       * Returns all plan files from dev/plans/.
       */
      getPlans: {
        params: Record<string, never>;
        response: { name: string; filename: string }[];
      };

      /**
       * Returns the markdown content of a plan file.
       */
      getPlanContent: {
        params: { filename: string };
        response: string;
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
       * Sent when plan files have changed on disk.
       */
      plansChanged: Record<string, never>;
    };
  }>;
};
