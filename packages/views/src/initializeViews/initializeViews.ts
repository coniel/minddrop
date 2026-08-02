import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { DataViewsStore } from '../DataViewsStore';
import { ViewFileExtension } from '../constants';
import { ViewsLoadedEvent, ViewsLoadedEventData } from '../events';
import { readDataView } from '../readDataView';
import { getViewsDirPath } from '../utils/getViewsDirPath';

/**
 * Initializes data views by reading the data views directory and loading data views from the file system.
 *
 * @dispatches views:loaded
 */
export async function initializeViews(): Promise<void> {
  // Get all workspaces
  const workspaces = Workspaces.getAll();

  // Get data views paths from workspaces
  const viewFileEntries = (
    await Promise.all(
      workspaces.map(async (workspace) => {
        const viewDirPath = getViewsDirPath(workspace.path);

        if (await Fs.exists(viewDirPath)) {
          return Fs.readDir(viewDirPath);
        }
      }),
    )
  ).flat();

  // Get the data view file paths, filtering out any non-data view files
  const viewPaths = viewFileEntries
    .filter((entry) => !!entry)
    .filter((entry) => entry.path.endsWith(ViewFileExtension))
    .map((entry) => entry.path);

  // Read the data views
  const viewPromises = await Promise.all(viewPaths.map(readDataView));

  // Filter out null data views
  const views = viewPromises.filter((view) => view !== null);

  // Load the data views into the store
  DataViewsStore.load(views);

  // Dispatch a data views loaded event
  Events.dispatch<ViewsLoadedEventData>(ViewsLoadedEvent, views);
}
