import { describe, expect, it } from 'vitest';
import { objectEntry1SqlRecord } from '../../test-utils';
import { EntrySyncRecord } from '../../types';
import { matchEntriesToSqlRecords } from './matchEntriesToSqlRecords';

// An existing SQL record matching the fixture record
const existingRecord: EntrySyncRecord = {
  id: objectEntry1SqlRecord.id,
  path: objectEntry1SqlRecord.path,
  lastModified: objectEntry1SqlRecord.lastModified,
  contentHash: objectEntry1SqlRecord.contentHash,
};

describe('matchEntriesToSqlRecords', () => {
  it('resolves fresh records to the existing entry ID on path match', () => {
    // A fresh read of a renamed entry: new path recorded in SQL by the
    // rename, fresh record minted with a different ID
    const freshRecord = {
      ...objectEntry1SqlRecord,
      id: 'freshly-minted-id',
    };

    const { records } = matchEntriesToSqlRecords(
      [freshRecord],
      [existingRecord],
    );

    // The fresh record should take over the existing entry ID
    expect(records).toEqual([{ ...freshRecord, id: objectEntry1SqlRecord.id }]);
  });

  it('keeps the minted ID for records without a path match', () => {
    // A fresh record at a path unknown to SQL
    const freshRecord = {
      ...objectEntry1SqlRecord,
      id: 'freshly-minted-id',
      path: '/workspace/Objects/New Entry.md',
    };

    const { records } = matchEntriesToSqlRecords(
      [freshRecord],
      [existingRecord],
    );

    expect(records).toEqual([freshRecord]);
  });

  it('reports existing records without a fresh counterpart as deleted', () => {
    const { records, deletedIds } = matchEntriesToSqlRecords(
      [],
      [existingRecord],
    );

    expect(records).toEqual([]);
    expect(deletedIds).toEqual([existingRecord.id]);
  });

  it('does not report path-matched records as deleted', () => {
    const { deletedIds } = matchEntriesToSqlRecords(
      [objectEntry1SqlRecord],
      [existingRecord],
    );

    expect(deletedIds).toEqual([]);
  });
});
