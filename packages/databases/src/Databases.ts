import { handleDataTransfer } from './handleDataTransfer';

export { DatabasesStore as Store } from './DatabasesStore';
export { addDatabaseProperty as addProperty } from './addDatabaseProperty';
export { createDatabase as create } from './createDatabase';
export { getDatabase as get } from './getDatabase';
export { initializeDatabases as initialize } from './initializeDatabases';
export { removeDatabaseProperty as removeProperty } from './removeDatabaseProperty';
export { updateDatabase as update } from './updateDatabase';
export { updateDatabaseProperty as updateProperty } from './updateDatabaseProperty';
export { useDatabase as use, useDatabases as useAll } from './DatabasesStore';
export { writeDatabaseConfig as writeConfig } from './writeDatabaseConfig';
export { addDatabaseDesign as addDesign } from './addDatabaseDesign';
export { removeDatabaseDesign as removeDesign } from './removeDatabaseDesign';
export { updateDatabaseDesign as updateDesign } from './updateDatabaseDesign';
export { filterValidDatabaseFiles as filterFiles } from './utils';
export { getDatabaseDesign as getDesign } from './getDatabaseDesign';
export { getDefaultDatabaseDesign as getDefaultDesign } from './getDefaultDatabaseDesign';

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
