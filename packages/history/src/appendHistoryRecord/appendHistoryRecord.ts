import { Fs } from '@minddrop/file-system';
import { buildHistoryRecord } from '../buildHistoryRecord';
import { readHistoryLog } from '../readHistoryLog';
import { HistoryRecord, RecordHistoryOptions } from '../types';
import { resolveLogFilePath, resolveSubjectHistoryDirPath } from '../utils';

/**
 * Appends a record to a subject's log, rolling the log over first
 * when it has outgrown its size limit.
 *
 * Callers must serialize this per subject. It reads the log and then
 * writes it back, so two appends at once would overwrite one another.
 *
 * @param options - The change to record.
 * @returns The appended record.
 */
export async function appendHistoryRecord(
  options: RecordHistoryOptions,
): Promise<HistoryRecord> {
  const { ownerPath, subjectKey } = options;
  const historyDirPath = resolveSubjectHistoryDirPath(ownerPath, subjectKey);
  const logFilePath = resolveLogFilePath(ownerPath, subjectKey);

  // Ensure the history directory exists, in case this is the
  // subject's first record.
  await Fs.ensureDir(historyDirPath);

  // Read the records already in the log
  const log = await readHistoryLog(logFilePath);

  // Build the record to append
  const record = await buildHistoryRecord(options);

  // Write the log back with the record appended
  await Fs.writeJsonFile(logFilePath, [...log, record], true);

  return record;
}
