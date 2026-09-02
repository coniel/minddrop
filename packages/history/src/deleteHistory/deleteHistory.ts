import { Fs } from '@minddrop/file-system';
import { resolveSubjectHistoryDirPath } from '../utils';

export interface DeleteHistoryOptions {
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
 * Deletes a subject's history. Used when removing a subject frees up
 * its key for another subject to take.
 *
 * @param options - The subject whose history to delete.
 */
export async function deleteHistory(
  options: DeleteHistoryOptions,
): Promise<void> {
  const historyDirPath = resolveSubjectHistoryDirPath(
    options.ownerPath,
    options.subjectKey,
  );

  // Check the subject has a history directory. It only gets one once
  // something has been recorded against it.
  if (!(await Fs.exists(historyDirPath))) {
    return;
  }

  // Delete the directory and everything in it
  await Fs.removeDir(historyDirPath, { recursive: true });
}
