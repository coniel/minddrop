import { Fs } from '@minddrop/file-system';
import { resolveArchiveLogPath } from '../utils';

/**
 * Renames a subject's active log to an archive named after the time
 * it was archived, leaving the active name free for a fresh log.
 *
 * @param logFilePath - The absolute path of the active log file.
 */
export async function archiveHistoryLog(logFilePath: string): Promise<void> {
  const historyDirPath = Fs.parentDirPath(logFilePath);

  // Rename the log to an archive name
  await Fs.rename(logFilePath, resolveArchiveLogPath(historyDirPath));
}
