import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ViewsStore } from '../ViewsStore';
import { ViewFileExtension } from '../constants';
import { ViewsLoadedEvent, ViewsLoadedEventData } from '../events';
import { readView } from '../readView';
import { getViewsDirPath } from '../utils/getViewsDirPath';

/**
 * Initializes views by reading the views directory and loading views from the file system.
 *
 * @dispatches views:loaded
 */
export async function initializeViews(): Promise<void> {
  // Read the views directory
  const viewFileEntries = await Fs.readDir(getViewsDirPath());

  // Get the view file paths, filtering out any non-view files
  const viewPaths = viewFileEntries
    .filter((entry) => entry.path.endsWith(ViewFileExtension))
    .map((entry) => entry.path);

  // Read the views
  const viewPromises = await Promise.all(viewPaths.map(readView));

  // Filter out null views
  const views = viewPromises.filter((view) => view !== null);

  // Load the views into the store
  ViewsStore.load(views);

  // Dispatch a views loaded event
  Events.dispatch<ViewsLoadedEventData>(ViewsLoadedEvent, views);
}
