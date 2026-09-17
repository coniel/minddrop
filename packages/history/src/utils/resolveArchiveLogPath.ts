import { Fs } from '@minddrop/file-system';
import { LogFileExtension } from '../constants';
import { resolveTimestampName } from './resolveTimestampName';

/**
 * Returns the absolute path an archived log takes in a history
 * directory, named after the time it is archived at so that it does
 * not collide with the active log or an earlier archive.
 *
 * @param historyDirPath - The absolute path of the history directory the archive belongs in.
 * @returns The absolute archive log file path.
 */
export function resolveArchiveLogPath(historyDirPath: string): string {
  const name = `history-${resolveTimestampName(new Date())}`;

  return Fs.concatPath(historyDirPath, `${name}.${LogFileExtension}`);
}
