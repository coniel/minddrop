import { Fs } from '@minddrop/file-system';
import { clearRecordedSqlStatements } from './createRecordingSqlAdapter';
import { entryFilePath } from './fixtures';
import { seedSqlEntries } from './seedSqlEntries';
import { MockFs } from './setup-tests';

/**
 * Indexes every fixture entry at the contents currently on disk, so
 * that nothing appears changed until a file is edited.
 */
export function indexAtCurrentContents(): void {
  // Reseed the records with the current on-disk content hashes
  seedSqlEntries((record) => ({
    ...record,
    contentHash: Fs.hashContents(
      MockFs.readTextFile(
        entryFilePath({ database: record.databaseId, path: record.path }),
      ),
    ),
  }));

  // Drop the reseeding statements from the log
  clearRecordedSqlStatements();
}
