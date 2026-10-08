import * as Fixtures from './fixtures';
import {
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './setup-fixtures';

export * from './setup-tests';
export * from './setup-sql';
export * from './createMockBackendAdapter';
export * from './createRecordingSqlAdapter';
export * from './appendToEntryFile';
export * from './breakEntryFile';
export * from './createEntryFileChange';
export * from './indexAtCurrentContents';
export * from './resolveRecordPropertyValue';
export * from './getRecordByPath';
export * from './resolveRecordedDeletedEntryIds';
export * from './seedSqlDatabases';
export * from './seedSqlEntries';
export * from './resolveUpsertedEntryPaths';
export * from './fixtures';
export * from './withoutDatabaseProperty';
export * from './connectTestSqlWorkspace';
export * from './databaseConfigFile';
export * from './expectHostileFilesSideBySide';
export * from './expectKeysUnchanged';
export * from './snapshotPlaceholders';
export * from './flushFileSystemChangeDebounces';
export * from './indexThenBreak';
export * from './setupHostileWorkspace';
export * from './snapshotIndex';
export * from './writeHostileWorkspace';
export {
  clearEntryFocusRequest,
  getEntryFocusRequest,
} from '../EntryFocusRequestStore';
export { registerEntryFilterAdapter } from '../registerEntryFilterAdapter';

export const DatabaseFixtures = {
  ...Fixtures,
  setup: setupDatabaseFixtures,
  cleanup: cleanupDatabaseFixtures,
};
