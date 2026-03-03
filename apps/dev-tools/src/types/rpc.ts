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
       * Returns the current file content from disk.
       */
      getCurrentFileContent: {
        params: { path: string };
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
       * Adds a file to an existing manifest.
       */
      addFileToManifest: {
        params: { slug: string; file: string };
        response: void;
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
