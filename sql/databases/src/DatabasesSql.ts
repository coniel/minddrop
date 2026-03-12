import {
  DatabaseEntriesSqlSyncedEvent,
  DatabasePropertySqlSyncedEvent,
  DatabaseSqlReindexedEvent,
  DatabaseSqlSyncedEvent,
} from './events';

export {
  upsertEntries,
  deleteEntries,
  upsertDatabase,
  deleteDatabase,
  renameProperty,
  getDatabaseName,
  getDatabaseIcon,
  getEntryTimestamps,
  getVersion,
  getAllEntries,
  getAllDatabases,
  getEntryTextContent,
  getEntryPropertyValues,
} from './operations';

export { convertEntryToSqlRecord } from './utils';

export { SCHEMA_SQL, SCHEMA_VERSION } from './schema';

export { EXCLUDED_TYPES_SQL } from './constants';

export { initializeDatabasesSql as initialize } from './initialize';

export const events = {
  entriesSqlSynced: DatabaseEntriesSqlSyncedEvent,
  databaseSqlSynced: DatabaseSqlSyncedEvent,
  propertySqlSynced: DatabasePropertySqlSyncedEvent,
  databaseSqlReindexed: DatabaseSqlReindexedEvent,
} as const;
