import { HistoryRecord, HistorySubject } from '../types';
import { readLogFiles } from '../utils';

export type ReadHistoryOptions = HistorySubject;

/**
 * Reads a subject's history.
 *
 * @param options - The subject to read the history of.
 * @returns The subject's records, oldest first.
 */
export async function readHistory(
  options: ReadHistoryOptions,
): Promise<HistoryRecord[]> {
  return readLogFiles(options);
}
