import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
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
  // The active workspace's data views directory
  const viewsDirPath = resolveViewsDirPath();

  // Read the data view file paths, none until the workspace has views
  const viewPaths = (await Fs.exists(viewsDirPath))
    ? (await Fs.readDir(viewsDirPath)).map((entry) => entry.path)
    : [];

  // Read the data views
  const viewPromises = await Promise.all(viewPaths.map(loadDataView));

  // Filter out null data views
  const views = viewPromises.filter((view) => view !== null);

  // Load the data views into the store
  DataViewsStore.load(views);

  // Apply changes made to data view files outside of the app
  Events.on(Fs.events.Changed, 'data-views', (data) =>
    onFileSystemChanged(data),
  );

  // Rewrite view files when referenced item addresses change
  Events.on(ItemReferences.events.AddressesChanged, 'data-views', (data) =>
    onItemAddressesChanged(data),
  );

  // Dispatch a data views loaded event
  Events.dispatch(DataViewsLoadedEvent, views);
}
