import { CollectionsStore } from '../CollectionsStore';
import { Collection } from '../types';

/**
 * Retrieves all collections, including virtual ones.
 *
 * @param workspaceId - The workspace whose collections to retrieve. Omit for the active workspace.
 * @returns All collections.
 */
export function getAllCollections(workspaceId?: string): Collection[] {
  return CollectionsStore.in(workspaceId).getAllArray();
}
