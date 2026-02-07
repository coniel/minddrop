import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { QueriesDirectory } from '../constants';
import { loadQueries } from '../loadQueries';

/**
 * Initializes queries by loading query configs from the queries directory.
 *
 * If the queries directory does not exist, it will be created.
 */
export async function initializeQueries(): Promise<void> {
  const queriesDirPath = Fs.concatPath(Paths.workspace, QueriesDirectory);

  // Ensure that the queries directory exists
  if (!(await Fs.exists(queriesDirPath))) {
    // Create the queries directory if it doesn't exist
    Fs.createDir(queriesDirPath);
  } else {
    // Load queries from the queries directory
    const files = await Fs.readDir(queriesDirPath);

    // Filter out files that are not query configs
    const queryFiles = files
      .filter((file) => file.path.endsWith('.query'))
      .map((file) => file.path);

    // Load the queries
    await loadQueries(queryFiles);
  }
}
