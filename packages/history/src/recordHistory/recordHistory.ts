import { appendHistoryRecord } from '../appendHistoryRecord';
import { HistoryRecord, RecordHistoryOptions } from '../types';
import { resolveSubjectHistoryDirPath } from '../utils';

// The append in flight for each subject, keyed by its history
// directory path.
const appendsInFlight = new Map<string, Promise<unknown>>();

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
  const { ownerPath, subjectKey } = options;
  const historyDirPath = resolveSubjectHistoryDirPath(ownerPath, subjectKey);

  // Get the subject's append in flight, if it has one
  const pending = appendsInFlight.get(historyDirPath) ?? Promise.resolve();

  // Chain this append behind it, whether or not it succeeded.
  // Appending reads the log and then writes it back, so two at once
  // would overwrite one another.
  const append = pending
    .catch(() => undefined)
    .then(() => appendHistoryRecord(options));

  // Store this append as the subject's latest
  appendsInFlight.set(historyDirPath, append);

  try {
    return await append;
  } finally {
    // Check this is still the subject's latest append, and if so
    // remove it from the map.
    if (appendsInFlight.get(historyDirPath) === append) {
      appendsInFlight.delete(historyDirPath);
    }
  }
}
