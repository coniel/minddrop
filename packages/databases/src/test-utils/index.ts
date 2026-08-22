import * as Fixtures from './fixtures';
import {
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './setup-fixtures';

export * from './setup-tests';
export * from './setup-sql';
export * from './fixtures';

export const DatabaseFixtures = {
  ...Fixtures,
  setup: setupDatabaseFixtures,
  cleanup: cleanupDatabaseFixtures,
};
