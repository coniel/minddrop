import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { QueriesStore } from '../QueriesStore';
import { QueryFileExtension } from '../constants';
import { QueriesLoadedEvent, QueriesLoadedEventData } from '../events';
import { readQuery } from '../readQuery';
import { getQueriesDirPath } from '../utils';

/**
 * Initializes queries by loading query configs from the queries directory.
 *
 * If the queries directory does not exist, it will be created.
 */
export async function initializeQueries(): Promise<void> {
  const queriesDirPath = getQueriesDirPath();

  // Ensure that the queries directory exists
  await Fs.ensureDir(queriesDirPath);

  // Load queries from the queries directory
  const files = await Fs.readDir(queriesDirPath);

  // Filter out files that are not query configs
  const queryFilePaths = files
    .filter((file) => file.path.endsWith(QueryFileExtension))
    .map((file) => file.path);

  // Read the query files
  const queryPromises = await Promise.all(
    queryFilePaths.map((path) => readQuery(path)),
  );

  // Filter out null queries
  const queries = queryPromises.filter((query) => query !== null);

  // Load the queries into the store
  QueriesStore.load(queries);

  // Dispatch a queries loaded event
  Events.dispatch<QueriesLoadedEventData>(QueriesLoadedEvent, queries);
}
