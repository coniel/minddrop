// Write operations
export { sqlUpsertDatabase } from './sqlUpsertDatabase';
export { sqlDeleteDatabase } from './sqlDeleteDatabase';
export { sqlUpsertEntries } from './sqlUpsertEntries';
export { sqlDeleteEntries } from './sqlDeleteEntries';
export { sqlRenameProperty } from './sqlRenameProperty';
export { sqlReindexEntries } from './sqlReindexEntries';
export { sqlUpdateEntryMetadata } from './sqlUpdateEntryMetadata';

// Read operations
export { sqlGetDatabaseName } from './sqlGetDatabaseName';
export { sqlGetDatabaseIcon } from './sqlGetDatabaseIcon';
export { sqlGetVersion } from './sqlGetVersion';
export { sqlGetAllEntries } from './sqlGetAllEntries';
export { sqlGetEntryTextContent } from './sqlGetEntryTextContent';
export { sqlGetAllDatabases } from './sqlGetAllDatabases';
export { sqlGetEntrySyncRecords } from './sqlGetEntrySyncRecords';
export { sqlGetEntryPropertyValues } from './sqlGetEntryPropertyValues';
export { sqlGetEntriesFull } from './sqlGetEntriesFull';
export { sqlQueryEntries } from './sqlQueryEntries';
export type { SqlQueryEntriesOptions } from './sqlQueryEntries';
export { sqlQueryScopedEntries } from './sqlQueryScopedEntries';
export type { SqlQueryScopedEntriesOptions } from './sqlQueryScopedEntries';
export { sqlCountScopedEntries } from './sqlCountScopedEntries';

// Init
export { initializeDatabasesBackend } from './initializeDatabasesBackend';
export type { InitializeBackendResult } from './initializeDatabasesBackend';
export { backgroundSyncDatabases } from './backgroundSyncDatabases';
export { syncEntryFiles } from './syncEntryFiles';
export { sqlGetEntryIdsByAddress } from './sqlGetEntryIdsByAddress';
// Schema
export { SCHEMA_SQL, SCHEMA_VERSION } from './schema';
