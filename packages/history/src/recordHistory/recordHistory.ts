import { appendLogRecord } from '../appendLogRecord';
import { buildHistoryRecord } from '../buildHistoryRecord';
import { HistoryRecord, RecordHistoryOptions } from '../types';
import { resolveSubjectHistoryDirPath } from '../utils';

/**
 * Records a change against a subject's history, stamping it with the
 * current time and appending it to the subject's log.
 *
 * A content change is given the contents themselves. They are stored
 * beside the log and the record points at them, so callers do not
 * have to know the layout.
 *
 * @param options - The change to record.
 * @returns The recorded change.
 */
export async function recordHistory(
  options: RecordHistoryOptions,
): Promise<HistoryRecord> {
  const historyDirPath = resolveSubjectHistoryDirPath(options);

  // Append the record to the subject's log
  return appendLogRecord(historyDirPath, () => buildHistoryRecord(options));
}
