import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { QueriesStore } from '../QueriesStore';
import { QueriesDirectory } from '../constants';
import { readQueryConfig } from '../readQueryConfig';

/**
 * Loads query configs from the query directory into the store.
 */
export async function loadQueries(): Promise<void> {
  // Path to queries directory
  const path = Fs.concatPath(Paths.workspace, QueriesDirectory);

  // Get all files in the directory
  const files = await Fs.readDir(path);

  // Filter out files that are not query configs
  const queryFiles = files
    .filter((file) => file.path.endsWith('.query'))
    .map((file) => file.path);

  // Read the query configs
  const queries = await Promise.all(
    queryFiles.map((path) => readQueryConfig(path)),
  );

  // Load the queries into the store
  QueriesStore.load(queries);
}
