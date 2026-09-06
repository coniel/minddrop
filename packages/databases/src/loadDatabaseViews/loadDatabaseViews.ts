import {
  DataViews,
  StoredDataView,
  VirtualDataViewData,
} from '@minddrop/data-views';
import { Fs } from '@minddrop/file-system';
import { normalizeDatabaseConfigIds } from '../normalizeDatabaseConfigIds';
import type { Database } from '../types';
import { resolveDatabaseViewsDirPath } from '../utils';

/**
 * Loads database views from the databases' view directories into
 * the ViewsStore as virtual views, normalizing each database
 * config's view ID list against the view files found.
 *
 * @param databases - The databases whose views to load.
 */
export async function loadDatabaseViews(databases: Database[]): Promise<void> {
  // Read each database's stored views from disk
  const viewData = (await Promise.all(databases.map(readDatabaseViews))).flat();

  if (viewData.length === 0) {
    return;
  }

  // Load the views as virtual views
  DataViews.loadVirtual(viewData);
}

/**
 * Reads a database's stored views from its views directory and
 * normalizes the config's view ID list against them.
 *
 * @param database - The database whose views to read.
 * @returns The database's views as virtual data view data.
 */
async function readDatabaseViews(
  database: Database,
): Promise<VirtualDataViewData[]> {
  // Path to the database's views directory
  const dirPath = resolveDatabaseViewsDirPath(database.path);

  // The stored views read from the views directory, empty for
  // databases without one.
  let storedViews: StoredDataView[] = [];

  if (await Fs.exists(dirPath)) {
    // List the view files
    const viewFiles = await Fs.readDir(dirPath);

    // Read and parse each view file, dropping unreadable ones
    storedViews = (
      await Promise.all(
        viewFiles
          .filter((file) => file.path.endsWith('.json'))
          .map(readStoredView),
      )
    ).filter((storedView): storedView is StoredDataView => !!storedView);
  }

  // Normalize the config's view ID list against the views found
  normalizeDatabaseConfigIds(database.id, 'views', storedViews);

  return storedViews.map((storedView) => ({
    ...storedView,
    dataSource: { type: 'database' as const, id: database.id },
    // The database owning the view is responsible for persisting it
    owner: database.id,
  }));
}

/**
 * Reads a single stored view from a view file.
 *
 * @param file - The view file's directory entry.
 * @returns The deserialized stored view, or null if reading fails.
 */
async function readStoredView(file: {
  path: string;
}): Promise<StoredDataView | null> {
  try {
    const storedView = await Fs.readJsonFile<StoredDataView>(file.path);

    // Restore the view's dates and resolve its config references
    return DataViews.deserialize(storedView);
  } catch {
    return null;
  }
}
