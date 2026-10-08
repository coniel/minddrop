import {
  ContentTypes,
  DatabaseEntityType,
  DatabasesIcon,
  DefaultDatabaseIcon,
  DefaultDesignId,
  DefaultEntrySort,
  MULTI_VALUE_PROPERTY_TYPES,
} from './constants';
import { BlankDatabaseTemplate } from './database-templates';
import { DatabaseNotFoundError } from './errors';
import {
  DatabaseCreatedEvent,
  DatabaseDeletedEvent,
  DatabasePropertyAddedEvent,
  DatabasePropertyOptionRenamedEvent,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRenamedEvent,
  DatabasePropertySqlSyncedEvent,
  DatabasePropertyUpdatedEvent,
  DatabaseRenamedEvent,
  DatabaseSqlReindexedEvent,
  DatabaseSqlSyncedEvent,
  DatabaseUpdatedEvent,
  DatabasesBackgroundSyncedEvent,
  EntriesSqlSyncedEvent,
  EntryMetadataUpdatedEvent,
  OpenDatabaseViewEvent,
} from './events';
import { LAYOUT_CONTEXTS, layoutContextBaseType } from './layoutContexts';
import {
  sqlCountScopedEntries,
  sqlDeleteDatabase,
  sqlDeleteEntries,
  sqlGetAllDatabases,
  sqlGetDatabaseIcon,
  sqlGetDatabaseName,
  sqlGetEntriesFull,
  sqlGetEntryPropertyValues,
  sqlGetEntryShortPropertyValues,
  sqlGetEntrySummaries,
  sqlGetEntrySyncRecords,
  sqlGetVersion,
  sqlQueryEntries,
  sqlQueryScopedEntries,
  sqlReindexEntries,
  sqlRenameProperty,
  sqlSearchEntryContent,
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
  PropertyUpdated: DatabasePropertyUpdatedEvent,
  PropertyRemoved: DatabasePropertyRemovedEvent,
  PropertyRenamed: DatabasePropertyRenamedEvent,
  PropertyOptionRenamed: DatabasePropertyOptionRenamedEvent,
  EntryMetadataUpdated: EntryMetadataUpdatedEvent,
  EntriesSqlSynced: EntriesSqlSyncedEvent,
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
  ContentTypes,
  DefaultDesignId,
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
  reindexEntries: sqlReindexEntries,
  updateEntryMetadata: sqlUpdateEntryMetadata,
  getDatabaseName: sqlGetDatabaseName,
  getDatabaseIcon: sqlGetDatabaseIcon,
  getVersion: sqlGetVersion,
  getEntrySummaries: sqlGetEntrySummaries,
  getEntriesFull: sqlGetEntriesFull,
  getEntryShortPropertyValues: sqlGetEntryShortPropertyValues,
  getAllDatabases: sqlGetAllDatabases,
  getEntrySyncRecords: sqlGetEntrySyncRecords,
  getEntryPropertyValues: sqlGetEntryPropertyValues,
  queryEntries: sqlQueryEntries,
  queryScopedEntries: sqlQueryScopedEntries,
  countScopedEntries: sqlCountScopedEntries,
  searchEntryContent: sqlSearchEntryContent,
} as const;
export { registerDatabaseBackendAdapter as registerBackendAdapter } from './DatabaseBackendAdapter';
export type { DatabaseBackendAdapter } from './DatabaseBackendAdapter';
export { initializeDatabasesBackend as initializeBackend } from './sql';
export { backgroundSyncDatabases as backgroundSync } from './sql';
export { syncEntryFiles } from './sql';
export { syncDatabaseConfigs } from './sql';
export { fillEntryContentIndex } from './sql';
export { handleBackgroundSyncResult } from './handleBackgroundSyncResult';
export { DatabasesStore as Store } from './DatabasesStore';
export { DatabaseSettingsStore as SettingsStore } from './DatabaseSettingsStore';
export { getAllDatabases as getAll } from './getAllDatabases';
export { addDatabaseProperty as addProperty } from './addDatabaseProperty';
export { createDatabase as create } from './createDatabase';
export { deleteDatabase as delete } from './deleteDatabase';
export { clearEntries } from './clearEntries';
export { getDatabase as get } from './getDatabase';
export { getDatabasesFromEntries as getFromEntries } from './getDatabasesFromEntries';
export { initializeDatabases as initialize } from './initializeDatabases';
export { loadWorkspaceDatabases as loadWorkspace } from './loadWorkspaceDatabases';
export { removeDatabaseProperty as removeProperty } from './removeDatabaseProperty';
export { renameDatabase as rename } from './renameDatabase';
export { renameDatabaseProperty as renameProperty } from './renameDatabaseProperty';
export { renameDatabasePropertyOption as renamePropertyOption } from './renameDatabasePropertyOption';
export { searchDatabases as search } from './utils';
export { getRecentDatabases as getRecent } from './utils';
export { updateDatabase as update } from './updateDatabase';
export { getDatabaseDefaults as getDefaults } from './getDatabaseDefaults';
export { setDatabaseDefault as setDefault } from './setDatabaseDefault';
export { useDatabaseDefaults as useDefaults } from './DatabaseSettingsStore';
export { useDatabaseContentDefaults as useContentDefaults } from './DatabaseSettingsStore';
export { setDatabaseContentDefault as setContentDefault } from './setDatabaseContentDefault';
export { setEntrySerializer } from './setEntrySerializer';
export { setDatabasePropertyFileStorage as setPropertyFileStorage } from './setDatabasePropertyFileStorage';
export { updateDatabaseProperty as updateProperty } from './updateDatabaseProperty';
export { useDatabase as use, useDatabases as useAll } from './DatabasesStore';
export { useDatabasesFromEntries as useFromEntries } from './useDatabasesFromEntries';
export { useDatabasesByContentType as useByContentType } from './useDatabasesByContentType';
export { resolveSortableEntryProperties as sortableProperties } from './utils';
export { useSortableEntryProperties as useSortableProperties } from './useSortableEntryProperties';
export { resolveFilterableEntryProperties as filterableProperties } from './utils';
export { useFilterableEntryProperties as useFilterableProperties } from './useFilterableEntryProperties';
export { writeDatabaseConfig as writeConfig } from './writeDatabaseConfig';
export {
  convertEntryToSqlRecord,
  convertSqlRecordToEntry,
  filterValidDatabaseFiles as filterFiles,
  filterDatabasesByContentType as filterByContentType,
  withImplicitMetadataProperties,
} from './utils';
export { readWorkspaceDatabases } from './readWorkspaceDatabases';
export { setDatabaseColorProperty as setColorProperty } from './setDatabaseColorProperty';
export { useDefaultDatabaseDesign as useDefaultDesign } from './useDefaultDatabaseDesign';
export { resolveDatabaseDesign as resolveDesign } from './utils';
export { useDatabaseDesigns as useDesigns } from './useDatabaseDesigns';
export { setDatabaseDefaultDesign as setDefaultDesign } from './setDatabaseDefaultDesign';
