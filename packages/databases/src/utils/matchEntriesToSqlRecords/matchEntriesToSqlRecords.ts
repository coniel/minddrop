import { EntrySyncRecord, SqlEntryRecord } from '../../types';

export interface MatchEntriesToSqlRecordsResult {
  /**
   * The fresh records with their IDs resolved to existing entry IDs
   * where a path match exists.
   */
  records: SqlEntryRecord[];

  /**
   * The IDs of existing records whose path has no fresh counterpart.
   */
  deletedIds: string[];
}

/**
 * Matches freshly read entry records against existing SQL records
 * by path. Fresh records whose path matches an existing record
 * take over the existing entry ID; records without a path match
 * keep their freshly minted ID. Existing records whose path has
 * no fresh counterpart are reported as deleted.
 *
 * @param freshRecords - The entry records read from the filesystem.
 * @param existingRecords - The existing SQL entry sync records.
 * @returns The ID-resolved records and deleted entry IDs.
 */
export function matchEntriesToSqlRecords(
  freshRecords: SqlEntryRecord[],
  existingRecords: EntrySyncRecord[],
): MatchEntriesToSqlRecordsResult {
  // Index the existing records by path
  const existingByPath = new Map(
    existingRecords.map((record) => [record.path, record]),
  );

  // Resolve fresh records to existing entry IDs on path match
  const records = freshRecords.map((record) => {
    const existing = existingByPath.get(record.path);

    if (!existing) {
      return record;
    }

    return { ...record, id: existing.id };
  });

  // Collect the paths present on disk
  const freshPaths = new Set(freshRecords.map((record) => record.path));

  // Existing records with no file at their path have been deleted
  const deletedIds = existingRecords
    .filter((record) => !freshPaths.has(record.path))
    .map((record) => record.id);

  return { records, deletedIds };
}
