import { Collections, VirtualCollectionData } from '@minddrop/collections';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import type { Database, DatabaseEntry } from '../types';
import { virtualCollectionId, virtualCollectionName } from '../utils';

/**
 * Loads database entries into a workspace's store record and
 * hydrates virtual collections from collection properties.
 *
 * @param databases - The databases the entries belong to.
 * @param entries - The entries to load.
 * @param workspaceId - The ID of the workspace the entries belong to.
 */
export function loadDatabaseEntries(
  databases: Database[],
  entries: DatabaseEntry[],
  workspaceId: string,
): void {
  // Load entries into the workspace's store record
  DatabaseEntriesStore.in(workspaceId).load(entries);

  // Hydrate virtual collections from entries with collection properties
  const virtualCollectionData: VirtualCollectionData[] = [];

  databases.forEach((database) => {
    // Find collection properties in the database schema
    const collectionProperties = database.properties.filter(
      (property) => property.type === 'collection',
    );

    // If there are no collection properties, there is nothing to do
    if (collectionProperties.length === 0) {
      return;
    }

    // Get entries belonging to this database
    const dbEntries = entries.filter((entry) => entry.database === database.id);

    // Create virtual collection data for each entry's collection properties
    dbEntries.forEach((entry) => {
      collectionProperties.forEach((property) => {
        virtualCollectionData.push({
          id: virtualCollectionId(entry.id, property.name),
          name: virtualCollectionName(
            database.name,
            entry.title,
            property.name,
          ),
          items: (entry.properties[property.name] as string[]) || [],
        });
      });
    });
  });

  // Load virtual collections
  if (virtualCollectionData.length > 0) {
    Collections.loadVirtual(virtualCollectionData, workspaceId);
  }
}
