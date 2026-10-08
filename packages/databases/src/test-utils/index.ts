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
export * from './entryFileChange';
export * from './indexAtCurrentContents';
export * from './propertyValue';
export * from './recordByPath';
export * from './recordedDeletedEntryIds';
export * from './seedSqlDatabases';
export * from './seedSqlEntries';
export * from './upsertedEntryPaths';
export * from './fixtures';
export * from './withoutDatabaseProperty';
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
