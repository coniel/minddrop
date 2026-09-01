import { Fs } from '@minddrop/file-system';
import { Snapshot } from '../types';
import {
  parseSnapshotDirName,
  readSnapshotManifest,
  resolveSubjectHistoryDirPath,
} from '../utils';

export interface ListSnapshotsOptions {
  /**
   * The absolute path of the directory whose history to list.
   */
  ownerPath: string;

  /**
   * The subject's key within the owner.
   */
  subjectKey: string;
}

/**
 * Lists a subject's snapshots, read from its history directory
 * rather than from an index, so that snapshots which arrived by sync
 * are listed like any other.
 *
 * @param options - The subject to list the snapshots of.
 * @returns The subject's snapshots, most recent first.
 */
export async function listSnapshots(
  options: ListSnapshotsOptions,
): Promise<Snapshot[]> {
  const { ownerPath, subjectKey } = options;
  const historyDirPath = resolveSubjectHistoryDirPath(ownerPath, subjectKey);

  // A subject which has never been captured has no history directory
  if (!(await Fs.exists(historyDirPath))) {
    return [];
  }

  const entries = await Fs.readDir(historyDirPath);

  // Ignore anything which is not named as a snapshot directory
  const snapshotDirs = entries.filter(
    (entry) => parseSnapshotDirName(entry.name || '') !== null,
  );

  // Read each snapshot's manifest for what its directory name does
  // not record
  const snapshots = await Promise.all(
    snapshotDirs.map(async (dir) => {
      const manifest = await readSnapshotManifest(dir.path);

      if (!manifest) {
        return null;
      }

      return { ...manifest, path: dir.path };
    }),
  );

  // Drop the directories whose manifest could not be read
  const readable = snapshots.filter(
    (snapshot): snapshot is Snapshot => snapshot !== null,
  );

  return readable.sort(
    (a, b) => b.capturedAt.getTime() - a.capturedAt.getTime(),
  );
}
