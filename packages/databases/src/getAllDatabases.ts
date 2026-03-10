import { DatabasesStore } from './DatabasesStore';
import { Database } from './types';

/**
 * Returns all databases as an array.
 */
export function getAllDatabases(): Database[] {
  return DatabasesStore.getAllArray();
}
