import { Fs } from '@minddrop/file-system';
import { SqlEntryRecord } from '../types';
import { clearRecordedSqlStatements } from './createRecordingSqlAdapter';
import { entryFilePath } from './fixtures';
import { seedSqlEntries } from './seedSqlEntries';
import { MockFs } from './setup-tests';

/**
 * Indexes every fixture entry at the contents currently on disk.
 * Nothing then appears changed until a file is edited.
 *
 * @param transform - Returns the record to index in place of a fixture
 *   record, given the record with its current content hash.
 */
export function indexAtCurrentContents(
  transform?: (record: SqlEntryRecord) => SqlEntryRecord,
): void {
  // Reseed the records with the current on-disk content hashes
  seedSqlEntries((record) => {
    // Hash the entry file's current contents into the record
    const hashedRecord = {
      ...record,
      contentHash: Fs.hashContents(
        MockFs.readTextFile(
          entryFilePath({ database: record.databaseId, path: record.path }),
        ),
      ),
    };

    // Apply the transform, if given
    return transform ? transform(hashedRecord) : hashedRecord;
  });

  // Drop the reseeding statements from the log
  clearRecordedSqlStatements();
}
