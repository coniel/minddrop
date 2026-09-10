import {
  DatabaseEntityType,
  DatabasesIcon,
  DefaultDatabaseIcon,
  DefaultEntrySort,
  MULTI_VALUE_PROPERTY_TYPES,
} from './constants';
import { BlankDatabaseTemplate } from './database-templates';
import { DatabaseNotFoundError } from './errors';
import {
  DatabaseCreatedEvent,
  DatabaseDeletedEvent,
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntryMetadataUpdatedEvent,
  DatabasePropertyAddedEvent,
  DatabasePropertyOptionRenamedEvent,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRenamedEvent,
  DatabasePropertySqlSyncedEvent,
  DatabaseRenamedEvent,
  DatabaseSqlReindexedEvent,
  DatabaseSqlSyncedEvent,
  DatabaseUpdatedEvent,
  DatabasesBackgroundSyncedEvent,
  OpenDatabaseViewEvent,
} from './events';
import { handleDataTransfer } from './handleDataTransfer';
import { LAYOUT_CONTEXTS, layoutContextBaseType } from './layoutContexts';
import {
  SCHEMA_SQL,
  SCHEMA_VERSION,
  sqlCountScopedEntries,
  sqlDeleteDatabase,
  sqlDeleteEntries,
  sqlGetAllDatabases,
  sqlGetAllEntries,
  sqlGetAllEntriesFull,
  sqlGetDatabaseIcon,
  sqlGetDatabaseName,
  sqlGetEntryPropertyValues,
  sqlGetEntrySyncRecords,
  sqlGetEntryTextContent,
  sqlGetVersion,
  sqlQueryEntries,
  sqlQueryScopedEntries,
  sqlReindexDatabaseEntries,
  sqlRenameProperty,
  sqlUpdateEntryMetadata,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from './sql';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: DatabaseCreatedEvent,
  Updated: DatabaseUpdatedEvent,
  Deleted: DatabaseDeletedEvent,
  Renamed: DatabaseRenamedEvent,
  PropertyAdded: DatabasePropertyAddedEvent,
  PropertyRemoved: DatabasePropertyRemovedEvent,
  PropertyRenamed: DatabasePropertyRenamedEvent,
  PropertyOptionRenamed: DatabasePropertyOptionRenamedEvent,
  EntryMetadataUpdated: DatabaseEntryMetadataUpdatedEvent,
  EntriesSqlSynced: DatabaseEntriesSqlSyncedEvent,
  SqlSynced: DatabaseSqlSyncedEvent,
  PropertySqlSynced: DatabasePropertySqlSyncedEvent,
  SqlReindexed: DatabaseSqlReindexedEvent,
  BackgroundSynced: DatabasesBackgroundSyncedEvent,
  OpenView: OpenDatabaseViewEvent,
} as const;

export const errors = {
  NotFound: DatabaseNotFoundError,
};

export const constants = {
  EntityType: DatabaseEntityType,
  Icon: DatabasesIcon,
  EntityDefaultIcon: DefaultDatabaseIcon,
  DefaultEntrySort,
  LayoutContexts: LAYOUT_CONTEXTS,
  LayoutContextBaseType: layoutContextBaseType,
  MultiValuePropertyTypes: MULTI_VALUE_PROPERTY_TYPES,
};

export const templates = {
  Blank: BlankDatabaseTemplate,
};

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
  getEntrySyncRecords: sqlGetEntrySyncRecords,
  getEntryPropertyValues: sqlGetEntryPropertyValues,
  queryEntries: sqlQueryEntries,
  queryScopedEntries: sqlQueryScopedEntries,
  countScopedEntries: sqlCountScopedEntries,
  SCHEMA_SQL,
  SCHEMA_VERSION,
} as const;
export { registerDatabaseBackendAdapter as registerBackendAdapter } from './DatabaseBackendAdapter';
export type { DatabaseBackendAdapter } from './DatabaseBackendAdapter';
export { initializeDatabasesBackend as initializeBackend } from './sql';
export { backgroundSyncDatabases as backgroundSync } from './sql';
export { handleBackgroundSyncResult } from './handleBackgroundSyncResult';
export { DatabasesStore as Store } from './DatabasesStore';
export { DatabaseDefaultsStore as DefaultsStore } from './DatabaseDefaultsStore';
export { getAllDatabases as getAll } from './getAllDatabases';
export { addDatabaseProperty as addProperty } from './addDatabaseProperty';
export { createDatabase as create } from './createDatabase';
export { deleteDatabase as delete } from './deleteDatabase';
export { clearDatabaseEntries as clearEntries } from './clearDatabaseEntries';
export { getDatabase as get } from './getDatabase';
export { getDatabasesFromEntries as getFromEntries } from './getDatabasesFromEntries';
export { initializeDatabases as initialize } from './initializeDatabases';
export { removeDatabaseProperty as removeProperty } from './removeDatabaseProperty';
export { renameDatabase as rename } from './renameDatabase';
export { renameDatabasePropertyOption as renamePropertyOption } from './renameDatabasePropertyOption';
export { searchDatabases as search } from './utils';
export { updateDatabase as update } from './updateDatabase';
export { getDatabaseDefaults as getDefaults } from './getDatabaseDefaults';
export { setDatabaseDefault as setDefault } from './setDatabaseDefault';
export { useDatabaseDefaults as useDefaults } from './DatabaseDefaultsStore';
export { setDatabaseEntrySerializer as setEntrySerializer } from './setDatabaseEntrySerializer';
export { setDatabasePropertyFileStorage as setPropertyFileStorage } from './setDatabasePropertyFileStorage';
export { updateDatabaseProperty as updateProperty } from './updateDatabaseProperty';
export { useDatabase as use, useDatabases as useAll } from './DatabasesStore';
export { useDatabasesFromEntries as useFromEntries } from './useDatabasesFromEntries';
export { resolveSortableEntryProperties as sortableProperties } from './utils';
export { useSortableEntryProperties as useSortableProperties } from './useSortableEntryProperties';
export { writeDatabaseConfig as writeConfig } from './writeDatabaseConfig';
export {
  convertEntryToSqlRecord,
  convertSqlRecordToEntry,
  filterValidDatabaseFiles as filterFiles,
  withImplicitMetadataProperties,
  resolveDesignPropertyMap,
} from './utils';
export { readWorkspaceDatabases } from './readWorkspaceDatabases';
export { getDefaultDatabaseLayout as getDefaultLayout } from './getDefaultDatabaseLayout';
export { getDatabaseDesignPropertyMap as getDesignPropertyMap } from './getDatabaseDesignPropertyMap';
export { setDatabaseDesignPropertyMap as setDesignPropertyMap } from './setDatabaseDesignPropertyMap';
export { clearDatabaseDesignPropertyMap as clearDesignPropertyMap } from './clearDatabaseDesignPropertyMap';
export { setDatabaseDesign as setDesign } from './setDatabaseDesign';
export { setDatabaseColorProperty as setColorProperty } from './setDatabaseColorProperty';
export { setDatabaseDefaultLayout as setDefaultLayout } from './setDatabaseDefaultLayout';
export { getDefaultDatabaseDesign as getDefaultDesign } from './getDefaultDatabaseDesign';
export { setDatabaseDefaultDesign as setDefaultDesign } from './setDatabaseDefaultDesign';

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
