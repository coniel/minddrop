import { Events } from '@minddrop/events';
import { FileSystemChangedEvent, Fs } from '@minddrop/file-system';
import { QueriesStore } from '../QueriesStore';
import { onFileSystemChanged } from '../event-handlers';
import { QueriesLoadedEvent } from '../events';
import { readQuery } from '../readQuery';
import { resolveQueriesDirPath } from '../utils';

/**
 * Initializes queries by loading query configs from the queries directory.
 *
 * If the queries directory does not exist, it will be created.
 */
export async function initializeQueries(): Promise<void> {
  const queriesDirPath = resolveQueriesDirPath();

  // Ensure that the queries directory exists
  await Fs.ensureDir(queriesDirPath);

  // Load queries from the queries directory
  const files = await Fs.readDir(queriesDirPath);

  // Read the query files
  const queryPromises = await Promise.all(
    files.map((file) => readQuery(file.path)),
  );

  // Filter out null queries
  const queries = queryPromises.filter((query) => query !== null);

  // Load the queries into the store
  QueriesStore.load(queries);

  // Apply changes made to query files outside of the app
  Events.on(FileSystemChangedEvent, 'queries', (data) =>
    onFileSystemChanged(data),
  );

  // Dispatch a queries loaded event
  Events.dispatch(QueriesLoadedEvent, queries);
}
