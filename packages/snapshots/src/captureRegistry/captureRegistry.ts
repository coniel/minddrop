export interface CaptureRecord {
  /**
   * When the subject was last captured.
   */
  capturedAt: Date;

  /**
   * Hash of the contents captured then.
   */
  contentHash: string;
}

// The last capture of each subject, keyed by the subject's history
// directory path. Derived state, seeded from disk on a miss.
const lastCaptures = new Map<string, CaptureRecord>();

/**
 * Records a subject's most recent capture, so that the following
 * writes to it can be measured against it without reading from disk.
 *
 * @param subjectHistoryDirPath - The subject's history directory path.
 * @param record - The capture to record.
 */
export function recordCapture(
  subjectHistoryDirPath: string,
  record: CaptureRecord,
): void {
  lastCaptures.set(subjectHistoryDirPath, record);
}

/**
 * Returns a subject's most recent capture as recorded in this
 * session.
 *
 * @param subjectHistoryDirPath - The subject's history directory path.
 * @returns The capture, or null if the subject has not been captured in this session.
 */
export function getLastCapture(
  subjectHistoryDirPath: string,
): CaptureRecord | null {
  return lastCaptures.get(subjectHistoryDirPath) ?? null;
}

/**
 * Moves a subject's recorded capture to follow it to a new history
 * directory, keeping the newer of the two records when both paths
 * carry one.
 *
 * @param fromPath - The subject's previous history directory path.
 * @param toPath - The subject's new history directory path.
 */
export function moveCaptureRecord(fromPath: string, toPath: string): void {
  const record = lastCaptures.get(fromPath);

  // The source path always gives up its record, whether or not it
  // ends up at the destination
  lastCaptures.delete(fromPath);

  if (!record) {
    return;
  }

  const existing = lastCaptures.get(toPath);

  // A destination captured more recently than the source keeps its
  // own record
  if (existing && existing.capturedAt >= record.capturedAt) {
    return;
  }

  lastCaptures.set(toPath, record);
}

/**
 * Clears a subject's recorded capture, so that a subject taking its
 * key next is not measured against it.
 *
 * @param subjectHistoryDirPath - The subject's history directory path.
 */
export function clearCaptureRecord(subjectHistoryDirPath: string): void {
  lastCaptures.delete(subjectHistoryDirPath);
}

/**
 * Clears all recorded captures.
 */
export function clearCaptureRegistry(): void {
  lastCaptures.clear();
}
