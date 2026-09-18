import { Fs } from '@minddrop/file-system';
import { LogFileName } from '../constants';
import { HistorySubject } from '../types';
import { resolveSubjectHistoryDirPath } from './resolveSubjectHistoryDirPath';

/**
 * Returns the absolute path of a subject's active log file, the one
 * new records are appended to.
 *
 * @param subject - The subject to resolve the log file path of.
 * @returns The absolute log file path.
 */
export function resolveLogFilePath(subject: HistorySubject): string {
  return Fs.concatPath(resolveSubjectHistoryDirPath(subject), LogFileName);
}
