import { Fs } from '@minddrop/file-system';
import { resolveHistoryDirPath } from './resolveHistoryDirPath';

/**
 * Returns the absolute path of a subject's history directory, which
 * holds one subdirectory per snapshot.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @param subjectKey - The subject's key within the owner.
 * @returns The absolute subject history directory path.
 */
export function resolveSubjectHistoryDirPath(
  ownerPath: string,
  subjectKey: string,
): string {
  return Fs.concatPath(resolveHistoryDirPath(ownerPath), subjectKey);
}
