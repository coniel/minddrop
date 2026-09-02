import { HistoryRecord } from '../types';
import { readLogFiles } from '../utils';

export interface ReadHistoryOptions {
  /**
   * The absolute path of the directory holding the history.
   */
  ownerPath: string;

  /**
   * The subject's key within the owner.
   */
  subjectKey: string;
}

/**
 * Reads a subject's history, read from its log files rather than from
 * an index, so that records which arrived by sync are read like any
 * other.
 *
 * @param options - The subject to read the history of.
 * @returns The subject's records, oldest first.
 */
export async function readHistory(
  options: ReadHistoryOptions,
): Promise<HistoryRecord[]> {
  return readLogFiles(options.ownerPath, options.subjectKey);
}
