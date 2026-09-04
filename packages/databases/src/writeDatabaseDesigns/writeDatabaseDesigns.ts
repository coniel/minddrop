import { Designs } from '@minddrop/designs-next';
import { DatabasesStore } from '../DatabasesStore';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Persists the database's current designs to its config file.
 *
 * @param databaseId - The ID of the database whose designs to persist.
 */
export async function writeDatabaseDesigns(databaseId: string): Promise<void> {
  // Get the database from the store, return early if it no
  // longer exists (handles deletion race).
  const database = DatabasesStore.get(databaseId);

  if (!database) {
    return;
  }

  // Strip the owner from the database's designs, it is derived
  // at load time.
  const storedDesigns = Designs.getByOwner(databaseId).map(
    ({ owner, ...design }) => design,
  );

  // Update the database config in the store
  DatabasesStore.update(databaseId, { designs: storedDesigns });

  // Persist to disk
  await writeDatabaseConfig(databaseId);
}
