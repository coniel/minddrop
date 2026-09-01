export type SnapshotCause = 'edit' | 'automation' | 'restore';

export interface SnapshotManifest {
  /**
   * When the capture ran, at full precision. The snapshot's
   * directory name records the same time at second precision.
   */
  capturedAt: Date;

  /**
   * What the capture was made for.
   */
  cause: SnapshotCause;

  /**
   * Hash of the captured contents, against which a later write's
   * contents are compared to keep captures idempotent.
   */
  contentHash: string;

  /**
   * The automation run the capture belongs to, present only for
   * captures made during one. Groups a run's captures into the set
   * reverting it restores.
   */
  runId?: string;
}

export interface Snapshot extends SnapshotManifest {
  /**
   * The path of the snapshot's directory, which holds the captured
   * file alongside the manifest.
   */
  path: string;
}
