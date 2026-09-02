import { Fs } from '@minddrop/file-system';
import { LogFileExtension } from '../../constants';
import { HistoryRecord } from '../../types';
import { resolveSubjectHistoryDirPath } from '../resolveSubjectHistoryDirPath';

/**
 * Reads every log file in a subject's history directory, merged into
 * one chronological list.
 *
 * Every file is read rather than just the active one. Rollover leaves
 * archives behind, and third-party sync writes conflicted copies when
 * two devices append to the same file, so both belong in the history.
 *
 * @param ownerPath - The absolute path of the owner directory.
 * @param subjectKey - The subject's key within the owner.
 * @returns The subject's records, oldest first.
 */
export async function readLogFiles(
  ownerPath: string,
  subjectKey: string,
): Promise<HistoryRecord[]> {
  const historyDirPath = resolveSubjectHistoryDirPath(ownerPath, subjectKey);

  // Check if the history directory exists. No directory means nothing
  // has been recorded against the subject.
  if (!(await Fs.exists(historyDirPath))) {
    return [];
  }

  // Read the history directory's contents
  const entries = await Fs.readDir(historyDirPath);

  // Filter for log files
  const logFiles = entries.filter(
    (entry) => Fs.getFileExtension(entry.path) === LogFileExtension,
  );

  // Read the log files
  const logs = await Promise.all(logFiles.map((file) => readLog(file.path)));

  // Sort by timestamp. Sorting is stable, so records sharing a
  // timestamp keep the order they were appended in.
  return logs
    .flat()
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Reads a single log file. A file that cannot be parsed is read as
 * empty, so a damaged one costs its own records rather than the
 * subject's whole history.
 */
async function readLog(path: string): Promise<HistoryRecord[]> {
  try {
    const records = await Fs.readJsonFile<HistoryRecord[]>(path);

    // Ignore a log holding anything but a list of records
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}
