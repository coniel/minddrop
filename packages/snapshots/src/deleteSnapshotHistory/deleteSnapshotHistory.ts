import { Fs } from '@minddrop/file-system';
import { clearCaptureRecord } from '../captureRegistry';
import { resolveSubjectHistoryDirPath } from '../utils';

export interface DeleteSnapshotHistoryOptions {
  /**
   * The absolute path of the directory holding the history.
   */
  ownerPath: string;

  /**
   * The key of the subject whose history to delete.
   */
  subjectKey: string;
}

/**
 * Deletes a subject's history, for subjects whose key becomes
 * available to another subject when they are removed.
 *
 * @param options - The subject whose history to delete.
 */
export async function deleteSnapshotHistory(
  options: DeleteSnapshotHistoryOptions,
): Promise<void> {
  const { ownerPath, subjectKey } = options;
  const path = resolveSubjectHistoryDirPath(ownerPath, subjectKey);

  // The subject taking the key next must not be measured against a
  // capture which is no longer on disk
  clearCaptureRecord(path);

  // Subjects which were never captured have no history to delete
  if (!(await Fs.exists(path))) {
    return;
  }

  await Fs.removeDir(path, { recursive: true });
}
