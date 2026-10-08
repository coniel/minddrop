import { setupTestSqlDatabase } from './setup-sql';
import { setup } from './setup-tests';

/**
 * Sets up a test workspace without the fixture databases.
 */
export function setupHostileWorkspace(): void {
  // Leave out the fixture databases' files and store items
  setup({
    loadDatabases: false,
    loadDatabaseFiles: false,
    loadEntries: false,
    loadEntryFiles: false,
    loadEntryPropertyFiles: false,
    loadDatabaseEntryTemplates: false,
    loadDatabaseEntryTemplateFiles: false,
    loadEntrySerializers: true,
  });

  // Register the in-memory SQL adapter
  setupTestSqlDatabase();
}
