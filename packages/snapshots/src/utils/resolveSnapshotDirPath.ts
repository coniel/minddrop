import { Fs } from '@minddrop/file-system';
import { resolveSnapshotDirName } from './resolveSnapshotDirName';
import { resolveSubjectHistoryDirPath } from './resolveSubjectHistoryDirPath';

/**
 * Returns the absolute path of a single snapshot's directory.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @param subjectKey - The subject's key within the owner.
 * @param capturedAt - The time at which the snapshot was captured.
 * @returns The absolute snapshot directory path.
 */
export function resolveSnapshotDirPath(
  ownerPath: string,
  subjectKey: string,
  capturedAt: Date,
): string {
  return Fs.concatPath(
    resolveSubjectHistoryDirPath(ownerPath, subjectKey),
    resolveSnapshotDirName(capturedAt),
  );
}
