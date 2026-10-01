import { Fs } from '@minddrop/file-system';
import { LogFileExtension } from '../../constants';
import { BaseHistoryRecord } from '../../types';

/**
 * Reads every log file in a log directory, merged into one
 * chronological list.
 *
 * Every file is read rather than just the active one. Rollover leaves
 * archives behind, and third-party sync writes conflicted copies when
 * two devices append to the same file, so both belong in the log.
 *
 * @param logDirPath - The absolute path of the directory holding the logs.
 * @returns The records, oldest first.
 */
export async function readLogFiles<TRecord extends BaseHistoryRecord>(
  logDirPath: string,
): Promise<TRecord[]> {
  // Check if the log directory exists. No directory means nothing
  // has been recorded in it.
  if (!(await Fs.exists(logDirPath))) {
    return [];
  }

  // Read the log directory's contents
  const entries = await Fs.readDir(logDirPath);

  // Filter for log files
  const logFiles = entries.filter(
    (entry) => Fs.getFileExtension(entry.path) === LogFileExtension,
  );

  // Read the log files
  const logs = await Promise.all(
    logFiles.map((file) => readLog<TRecord>(file.path)),
  );

  // Sort by timestamp. Sorting is stable, so records sharing a
  // timestamp keep the order they were appended in.
  return logs
    .flat()
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Reads a single log file. A file that cannot be parsed is read as
 * empty, so a damaged one costs its own records rather than the
 * whole log.
 */
async function readLog<TRecord>(path: string): Promise<TRecord[]> {
  try {
    const records = await Fs.readJsonFile<TRecord[]>(path);

    // Ignore a log holding anything but a list of records
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}
