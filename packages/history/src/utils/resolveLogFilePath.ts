import { Fs } from '@minddrop/file-system';
import { LogFileName } from '../constants';

/**
 * Returns the absolute path of the active log file in a log
 * directory, the one new records are appended to.
 *
 * @param logDirPath - The absolute path of the directory holding the log.
 * @returns The absolute log file path.
 */
export function resolveLogFilePath(logDirPath: string): string {
  return Fs.concatPath(logDirPath, LogFileName);
}
