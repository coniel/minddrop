import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { HistoryDirName } from '../constants';

/**
 * Returns the absolute path of a subject's history directory, which
 * holds its log files and its content directory.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @param subjectKey - The subject's key within the owner.
 * @returns The absolute subject history directory path.
 */
export function resolveSubjectHistoryDirPath(
  ownerPath: string,
  subjectKey: string,
): string {
  return Fs.concatPath(
    ownerPath,
    Paths.hiddenDirName,
    HistoryDirName,
    subjectKey,
  );
}
