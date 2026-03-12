import {
  DatabaseCreatedEvent,
  DatabaseDeletedEvent,
  DatabaseEntriesSqlSyncedEvent,
  DatabasePropertyAddedEvent,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRenamedEvent,
  DatabasePropertySqlSyncedEvent,
  DatabaseRenamedEvent,
  DatabaseSqlReindexedEvent,
  DatabaseSqlSyncedEvent,
  DatabaseUpdatedEvent,
} from './events';
import { handleDataTransfer } from './handleDataTransfer';

export const events = {
  created: DatabaseCreatedEvent,
  updated: DatabaseUpdatedEvent,
  deleted: DatabaseDeletedEvent,
  renamed: DatabaseRenamedEvent,
  propertyAdded: DatabasePropertyAddedEvent,
  propertyRemoved: DatabasePropertyRemovedEvent,
  propertyRenamed: DatabasePropertyRenamedEvent,
  entriesSqlSynced: DatabaseEntriesSqlSyncedEvent,
  databaseSqlSynced: DatabaseSqlSyncedEvent,
  propertySqlSynced: DatabasePropertySqlSyncedEvent,
  databaseSqlReindexed: DatabaseSqlReindexedEvent,
} as const;

export * as sql from './sql';
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
  filterValidDatabaseFiles as filterFiles,
} from './utils';
export { readWorkspaceDatabases } from './readWorkspaceDatabases';
export { getDefaultDatabaseDesign as getDefaultDesign } from './getDefaultDatabaseDesign';
export { getDatabaseDesignPropertyMap as getDesignPropertyMap } from './getDatabaseDesignPropertyMap';
export { removeDatabaseDesignPropertyMap as removeDesignPropertyMap } from './removeDatabaseDesignPropertyMap';
export { setDatabaseDesignPropertyMap as setDesignPropertyMap } from './setDatabaseDesignPropertyMap';

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
