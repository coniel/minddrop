// Write operations
export { sqlUpsertDatabase } from './sqlUpsertDatabase';
export { sqlDeleteDatabase } from './sqlDeleteDatabase';
export { sqlUpsertEntries } from './sqlUpsertEntries';
export { sqlDeleteEntries } from './sqlDeleteEntries';
export { sqlRenameProperty } from './sqlRenameProperty';
export { sqlReindexDatabaseEntries } from './sqlReindexDatabaseEntries';
export { sqlUpdateEntryMetadata } from './sqlUpdateEntryMetadata';

// Read operations
export { sqlGetDatabaseName } from './sqlGetDatabaseName';
export { sqlGetDatabaseIcon } from './sqlGetDatabaseIcon';
export { sqlGetVersion } from './sqlGetVersion';
export { sqlGetAllEntries } from './sqlGetAllEntries';
export { sqlGetEntryTextContent } from './sqlGetEntryTextContent';
export { sqlGetAllDatabases } from './sqlGetAllDatabases';
export { sqlGetEntryTimestamps } from './sqlGetEntryTimestamps';
export { sqlGetEntryPropertyValues } from './sqlGetEntryPropertyValues';
export { sqlGetAllEntriesFull } from './sqlGetAllEntriesFull';

// Init
export { sqlInitialize } from './sqlInitialize';
export type { SqlInitializeResult } from './sqlInitialize';
export { initializeDatabasesBackend } from './initializeDatabasesBackend';
export type { InitializeBackendResult } from './initializeDatabasesBackend';

// Schema
export { SCHEMA_SQL, SCHEMA_VERSION } from './schema';
