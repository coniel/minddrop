// Write operations
export { sqlUpsertDatabase } from './sqlUpsertDatabase';
export { sqlDeleteDatabase } from './sqlDeleteDatabase';
export { sqlUpsertEntries } from './sqlUpsertEntries';
export { sqlDeleteEntries } from './sqlDeleteEntries';
export { sqlRenameProperty } from './sqlRenameProperty';
export { sqlReindexDatabaseEntries } from './sqlReindexDatabaseEntries';

// Read operations
export { sqlGetDatabaseName } from './sqlGetDatabaseName';
export { sqlGetDatabaseIcon } from './sqlGetDatabaseIcon';
export { sqlGetVersion } from './sqlGetVersion';
export { sqlGetAllEntries } from './sqlGetAllEntries';
export { sqlGetEntryTextContent } from './sqlGetEntryTextContent';
export { sqlGetAllDatabases } from './sqlGetAllDatabases';
export { sqlGetEntryTimestamps } from './sqlGetEntryTimestamps';
export { sqlGetEntryPropertyValues } from './sqlGetEntryPropertyValues';

// Init
export { sqlInitialize } from './sqlInitialize';
export type { SqlInitializeResult } from './sqlInitialize';

// Schema
export { SCHEMA_SQL, SCHEMA_VERSION } from './schema';
