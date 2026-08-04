import { DataViews, serializeDataViewConfig } from '@minddrop/views';
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
  const allViews = DataViews.Store.getAllArray();
  const databaseViews = allViews.filter(
    (view) =>
      view.dataSource.type === 'database' && view.dataSource.id === databaseId,
  );

  // Strip runtime-only fields and convert each view's config
  // references into durable form for storage
  const storedViews = databaseViews.map(
    ({ dataSource, virtual, references, ...rest }) => ({
      ...rest,
      ...serializeDataViewConfig(rest.type, {
        options: rest.options,
        data: rest.data,
      }),
    }),
  );

  // Update the database config in the store
  DatabasesStore.update(databaseId, { views: storedViews });

  // Persist to disk
  await writeDatabaseConfig(databaseId);
}
