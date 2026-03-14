import { Views } from '@minddrop/views';
import { DatabasesStore } from '../DatabasesStore';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

/**
 * Persists the current database views to the database config file.
 *
 * @param databaseId - The ID of the database whose views to persist.
 */
export async function writeDatabaseViews(databaseId: string): Promise<void> {
  // Get the database from the store, return early if it no
  // longer exists (handles deletion race)
  const database = DatabasesStore.get(databaseId);

  if (!database) {
    return;
  }

  // Get all views for this database from the ViewsStore
  const allViews = Views.Store.getAll();
  const databaseViews = allViews.filter(
    (view) =>
      view.dataSource.type === 'database' && view.dataSource.id === databaseId,
  );

  // Strip dataSource and virtual from each view for storage
  const storedViews = databaseViews.map(
    ({ dataSource, virtual, ...rest }) => rest,
  );

  // Update the database config in the store
  DatabasesStore.update(databaseId, { views: storedViews });

  // Persist to disk
  await writeDatabaseConfig(databaseId);
}
