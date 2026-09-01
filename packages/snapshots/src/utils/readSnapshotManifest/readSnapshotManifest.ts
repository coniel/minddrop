import { Fs } from '@minddrop/file-system';
import { SnapshotManifestFileName } from '../../constants';
import { SnapshotManifest } from '../../types';

/**
 * Reads the manifest of the snapshot stored in the given directory.
 *
 * @param snapshotDirPath - The absolute path of the snapshot's directory.
 * @returns The manifest, or null if it is missing or unreadable.
 */
export async function readSnapshotManifest(
  snapshotDirPath: string,
): Promise<SnapshotManifest | null> {
  const path = Fs.concatPath(snapshotDirPath, SnapshotManifestFileName);

  // A directory without a manifest is not a snapshot the app wrote
  if (!(await Fs.exists(path))) {
    return null;
  }

  try {
    return await Fs.readJsonFile<SnapshotManifest>(path);
  } catch {
    // A manifest edited into invalid JSON by hand costs its snapshot
    // rather than the whole subject's history
    return null;
  }
}
