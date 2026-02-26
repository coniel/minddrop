import * as Fixtures from './test-utils/fixtures';
import {
  cleanupDatabaseFixtures,
  setupDatabaseFixtures,
} from './test-utils/setup-fixtures';

export * from './types';
export * from './errors';
export * from './events';
export * from './database-templates';
export * as Databases from './Databases';
export * as DatabaseAutomations from './DatabaseAutomations';
export * as DatabaseEntrySerializers from './DatabaseEntrySerializers';
export * as DatabaseEntries from './DatabaseEntries';
export * as DatabaseTemplates from './DatabaseTemplates';

export const DatabaseFixtures = {
  ...Fixtures,
  setup: setupDatabaseFixtures,
  cleanup: cleanupDatabaseFixtures,
};
