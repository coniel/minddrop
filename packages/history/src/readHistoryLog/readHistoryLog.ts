import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { archiveHistoryLog } from '../archiveHistoryLog';
import { LogSizeLimitBytes } from '../constants';
import { HistoryRecord } from '../types';

/**
 * Reads a subject's active log, archiving it and starting a fresh
 * one when it has outgrown its size limit, so that the log each
 * append rewrites stays small.
 *
 * @param logFilePath - The absolute path of the active log file.
 * @returns The records to append to, empty when the log was archived.
 */
export async function readHistoryLog(
  logFilePath: string,
): Promise<HistoryRecord[]> {
  // Check if the log exists. No log means nothing has been recorded
  // against the subject yet.
  if (!(await Fs.exists(logFilePath))) {
    return [];
  }

  // Read the log
  const contents = await Fs.readTextFile(logFilePath);

  // Check if the log has outgrown its size limit. If so, archive it
  // and start a fresh one.
  if (contents.length >= LogSizeLimitBytes) {
    await archiveHistoryLog(logFilePath);

    return [];
  }

  try {
    // Parse the log. JSON stores the timestamps as strings, so they
    // are revived as dates.
    const records = restoreDates(JSON.parse(contents));

    // Check the log holds a list of records, ignoring it if not
    return Array.isArray(records) ? records : [];
  } catch {
    // Archive a log that could not be parsed rather than writing over
    // it. It is the user's data and may be repairable by hand.
    await archiveHistoryLog(logFilePath);

    return [];
  }
}
