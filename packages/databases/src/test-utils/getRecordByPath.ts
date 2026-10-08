import { SqlEntryRecord } from '../types';

/**
 * Returns the entry record with the given path.
 *
 * @param records - The records to search.
 * @param path - The entry path to find.
 * @returns The record with the path.
 *
 * @throws {Error} If no record has the path.
 */
export function getRecordByPath(
  records: SqlEntryRecord[],
  path: string,
): SqlEntryRecord {
  // Find the record with the path
  const record = records.find((candidate) => candidate.path === path);

  // Throw if no record has the path
  if (!record) {
    throw new Error(`No entry record has the path "${path}".`);
  }

  return record;
}
