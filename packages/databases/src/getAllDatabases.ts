import { DatabasesStore } from './DatabasesStore';
import { Database } from './types';

/**
 * Returns all databases as an array.
 *
 * @param workspaceId - The workspace whose databases to return. Omit for the active workspace.
 */
export function getAllDatabases(workspaceId?: string): Database[] {
  return DatabasesStore.in(workspaceId).getAllArray();
}
