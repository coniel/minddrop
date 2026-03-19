import {
  DatabaseCreatedEvent,
  DatabaseDeletedEvent,
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryMetadataUpdatedEvent,
  DatabasePropertyAddedEvent,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRenamedEvent,
  DatabasePropertySqlSyncedEvent,
  DatabaseRenamedEvent,
  DatabaseSqlReindexedEvent,
  DatabaseSqlSyncedEvent,
  DatabaseUpdatedEvent,
  DatabasesBackgroundSyncedEvent,
} from './events';
import { handleDataTransfer } from './handleDataTransfer';
import {
  SCHEMA_SQL,
  SCHEMA_VERSION,
  sqlDeleteDatabase,
  sqlDeleteEntries,
  sqlGetAllDatabases,
  sqlGetAllEntries,
  sqlGetAllEntriesFull,
  sqlGetDatabaseIcon,
  sqlGetDatabaseName,
  sqlGetEntryPropertyValues,
  sqlGetEntryTextContent,
  sqlGetEntryTimestamps,
  sqlGetVersion,
  sqlReindexDatabaseEntries,
  sqlRenameProperty,
  sqlUpdateEntryMetadata,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from './sql';

export const events = {
  created: DatabaseCreatedEvent,
  updated: DatabaseUpdatedEvent,
  deleted: DatabaseDeletedEvent,
  renamed: DatabaseRenamedEvent,
  propertyAdded: DatabasePropertyAddedEvent,
  propertyRemoved: DatabasePropertyRemovedEvent,
  propertyRenamed: DatabasePropertyRenamedEvent,
  entryMetadataUpdated: DatabaseEntryMetadataUpdatedEvent,
  entriesSqlSynced: DatabaseEntriesSqlSyncedEvent,
  databaseSqlSynced: DatabaseSqlSyncedEvent,
  propertySqlSynced: DatabasePropertySqlSyncedEvent,
  databaseSqlReindexed: DatabaseSqlReindexedEvent,
  backgroundSynced: DatabasesBackgroundSyncedEvent,
} as const;

export const sql = {
  upsertDatabase: sqlUpsertDatabase,
  deleteDatabase: sqlDeleteDatabase,
  upsertEntries: sqlUpsertEntries,
  deleteEntries: sqlDeleteEntries,
  renameProperty: sqlRenameProperty,
  reindexDatabaseEntries: sqlReindexDatabaseEntries,
  updateEntryMetadata: sqlUpdateEntryMetadata,
  getDatabaseName: sqlGetDatabaseName,
  getDatabaseIcon: sqlGetDatabaseIcon,
  getVersion: sqlGetVersion,
  getAllEntries: sqlGetAllEntries,
  getAllEntriesFull: sqlGetAllEntriesFull,
  getEntryTextContent: sqlGetEntryTextContent,
  getAllDatabases: sqlGetAllDatabases,
  getEntryTimestamps: sqlGetEntryTimestamps,
  getEntryPropertyValues: sqlGetEntryPropertyValues,
  SCHEMA_SQL,
  SCHEMA_VERSION,
} as const;
export { registerDatabaseBackendAdapter as registerBackendAdapter } from './DatabaseBackendAdapter';
export type { DatabaseBackendAdapter } from './DatabaseBackendAdapter';
export { initializeDatabasesBackend as initializeBackend } from './sql';
export { backgroundSyncDatabases as backgroundSync } from './sql';
export { handleBackgroundSyncResult } from './handleBackgroundSyncResult';
export { DatabasesStore as Store } from './DatabasesStore';
export { getAllDatabases as getAll } from './getAllDatabases';
export { addDatabaseProperty as addProperty } from './addDatabaseProperty';
export { createDatabase as create } from './createDatabase';
export { getDatabase as get } from './getDatabase';
export { getDatabasesFromEntries as getFromEntries } from './getDatabasesFromEntries';
export { initializeDatabases as initialize } from './initializeDatabases';
export { removeDatabaseProperty as removeProperty } from './removeDatabaseProperty';
export { updateDatabase as update } from './updateDatabase';
export { updateDatabaseProperty as updateProperty } from './updateDatabaseProperty';
export { useDatabase as use, useDatabases as useAll } from './DatabasesStore';
export { writeDatabaseConfig as writeConfig } from './writeDatabaseConfig';
export {
  convertEntryToSqlRecord,
  convertSqlRecordToEntry,
  filterValidDatabaseFiles as filterFiles,
} from './utils';
export { readWorkspaceDatabases } from './readWorkspaceDatabases';
export { getDefaultDatabaseDesign as getDefaultDesign } from './getDefaultDatabaseDesign';
export { getDatabaseDesignPropertyMap as getDesignPropertyMap } from './getDatabaseDesignPropertyMap';
export { removeDatabaseDesignPropertyMap as removeDesignPropertyMap } from './removeDatabaseDesignPropertyMap';
export { setDatabaseDesignPropertyMap as setDesignPropertyMap } from './setDatabaseDesignPropertyMap';
export { setDatabaseViewDesign as setViewDesign } from './setDatabaseViewDesign';
export { clearDatabaseViewDesign as clearViewDesign } from './clearDatabaseViewDesign';

/**
 * Handles a drop event on a database.
 *
 * @param databaseId - The ID of the database to handle the drop event for.
 * @param event - The drop event to handle.
 */
export function handleDrop(
  databaseId: string,
  event: DragEvent | React.DragEvent,
) {
  event.stopPropagation();
  event.preventDefault();

  if (!event.dataTransfer) {
    return;
  }

  handleDataTransfer(databaseId, event);
}
