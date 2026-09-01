import { Fs } from '@minddrop/file-system';
import { SnapshotManifestFileName } from '../constants';
import { resolveSnapshotDirPath } from '../utils';

export interface ReadSnapshotOptions {
  /**
   * The absolute path of the directory whose history holds the
   * snapshot.
   */
  ownerPath: string;

  /**
   * The subject's key within the owner.
   */
  subjectKey: string;

  /**
   * The time at which the snapshot was captured.
   */
  capturedAt: Date;
}

/**
 * Reads the contents captured in a snapshot.
 *
 * @param options - The snapshot to read.
 * @returns The captured contents, or null if the snapshot is missing or empty.
 */
export async function readSnapshot(
  options: ReadSnapshotOptions,
): Promise<string | null> {
  const { ownerPath, subjectKey, capturedAt } = options;
  const path = resolveSnapshotDirPath(ownerPath, subjectKey, capturedAt);

  // Nothing was captured at the given time
  if (!(await Fs.exists(path))) {
    return null;
  }

  const entries = await Fs.readDir(path);

  // The captured file keeps its own name, so it is whichever file
  // sits beside the manifest
  const file = entries.find(
    (entry) => entry.name !== SnapshotManifestFileName && !entry.children,
  );

  // A snapshot directory holding only its manifest
  if (!file) {
    return null;
  }

  return Fs.readTextFile(file.path);
}
