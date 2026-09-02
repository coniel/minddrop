import { Fs } from '@minddrop/file-system';
import { LogFileExtension } from '../constants';
import { resolveTimestampName } from '../utils';

/**
 * Renames a subject's active log to an archive named after the time
 * it was archived, leaving the active name free for a fresh log.
 *
 * @param logFilePath - The absolute path of the active log file.
 */
export async function archiveHistoryLog(logFilePath: string): Promise<void> {
  const historyDirPath = Fs.parentDirPath(logFilePath);

  // Name the archive after the time it is being archived at
  const name = `history-${resolveTimestampName(new Date())}`;

  // Rename the log to the archive name
  await Fs.rename(
    logFilePath,
    Fs.concatPath(historyDirPath, `${name}.${LogFileExtension}`),
  );
}
