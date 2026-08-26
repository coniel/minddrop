import { Events } from '@minddrop/events';
import { FileSystemChangedEvent, Fs } from '@minddrop/file-system';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import { Workspaces } from '@minddrop/workspaces';
import { DataViewsStore } from '../DataViewsStore';
import { onFileSystemChanged, onItemAddressesChanged } from '../event-handlers';
import { DataViewsLoadedEvent } from '../events';
import { loadDataView } from '../loadDataView';
import { resolveViewsDirPath } from '../utils/resolveViewsDirPath';

/**
 * Initializes data views by reading the data views directory and loading data views from the file system.
 *
 * @dispatches data-views:loaded
 */
export async function initializeDataViews(): Promise<void> {
  // Get all workspaces
  const workspaces = Workspaces.getAll();

  // Get data views paths from workspaces
  const viewFileEntries = (
    await Promise.all(
      workspaces.map(async (workspace) => {
        const viewDirPath = resolveViewsDirPath(workspace.path);

        if (await Fs.exists(viewDirPath)) {
          return Fs.readDir(viewDirPath);
        }
      }),
    )
  ).flat();

  // Get the data view file paths, skipping workspaces without a views directory
  const viewPaths = viewFileEntries
    .filter((entry) => !!entry)
    .map((entry) => entry.path);

  // Read the data views
  const viewPromises = await Promise.all(viewPaths.map(loadDataView));

  // Filter out null data views
  const views = viewPromises.filter((view) => view !== null);

  // Load the data views into the store
  DataViewsStore.load(views);

  // Apply changes made to data view files outside of the app
  Events.on(FileSystemChangedEvent, 'data-views', ({ data }) =>
    onFileSystemChanged(data),
  );

  // Rewrite view files when referenced item addresses change
  Events.on(ItemAddressesChangedEvent, 'data-views', ({ data }) =>
    onItemAddressesChanged(data),
  );

  // Dispatch a data views loaded event
  Events.dispatch(DataViewsLoadedEvent, views);
}
