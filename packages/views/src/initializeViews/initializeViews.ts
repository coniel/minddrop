import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
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
  // Get all workspaces
  const workspaces = Workspaces.getAll();

  // Get views paths from workspaces
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

  // Get the view file paths, filtering out any non-view files
  const viewPaths = viewFileEntries
    .filter((entry) => !!entry)
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
