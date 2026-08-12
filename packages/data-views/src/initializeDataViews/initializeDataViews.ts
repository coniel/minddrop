import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import { Workspaces } from '@minddrop/workspaces';
import { DataViewsStore } from '../DataViewsStore';
import { onItemAddressesChanged } from '../event-handlers';
import { DataViewsLoadedEvent, DataViewsLoadedEventData } from '../events';
import { extractDataViewReferences } from '../extractDataViewReferences';
import { readDataView } from '../readDataView';
import { resolveDataViewConfig } from '../resolveDataViewConfig';
import { getViewsDirPath } from '../utils/getViewsDirPath';

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
        const viewDirPath = getViewsDirPath(workspace.path);

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
  const viewPromises = await Promise.all(viewPaths.map(readDataView));

  // Filter out null data views, resolve durable references into
  // item IDs, and index each view's references
  const views = viewPromises
    .filter((view) => view !== null)
    .map((view) => {
      // Resolve the config's durable references
      const config = resolveDataViewConfig(view.type, {
        options: view.options,
        data: view.data,
      });

      return {
        ...view,
        ...config,
        references: extractDataViewReferences(view.type, config),
      };
    });

  // Load the data views into the store
  DataViewsStore.load(views);

  // Rewrite view files when referenced item addresses change
  Events.on<ItemAddressesChangedEventData>(
    ItemAddressesChangedEvent,
    'data-views',
    ({ data }) => onItemAddressesChanged(data),
  );

  // Dispatch a data views loaded event
  Events.dispatch<DataViewsLoadedEventData>(DataViewsLoadedEvent, views);
}
