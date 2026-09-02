import { Fs } from '@minddrop/file-system';
import { LogFileName } from '../constants';
import { resolveSubjectHistoryDirPath } from './resolveSubjectHistoryDirPath';

/**
 * Returns the absolute path of a subject's active log file, the one
 * new records are appended to.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @param subjectKey - The subject's key within the owner.
 * @returns The absolute log file path.
 */
export function resolveLogFilePath(
  ownerPath: string,
  subjectKey: string,
): string {
  return Fs.concatPath(
    resolveSubjectHistoryDirPath(ownerPath, subjectKey),
    LogFileName,
  );
}
