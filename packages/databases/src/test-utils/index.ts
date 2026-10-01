import * as Fixtures from './fixtures';
import {
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './setup-fixtures';

export * from './setup-tests';
export * from './setup-sql';
export * from './createMockBackendAdapter';
export * from './createRecordingSqlAdapter';
export * from './fixtures';
export * from './withoutDatabaseProperty';
export {
  clearEntryFocusRequest,
  getEntryFocusRequest,
} from '../EntryFocusRequestStore';
export { registerDatabaseEntryFilterAdapter } from '../registerDatabaseEntryFilterAdapter';

export const DatabaseFixtures = {
  ...Fixtures,
  setup: setupDatabaseFixtures,
  cleanup: cleanupDatabaseFixtures,
};
