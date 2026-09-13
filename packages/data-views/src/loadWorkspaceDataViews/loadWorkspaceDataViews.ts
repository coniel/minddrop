import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewsLoadedEvent } from '../events';
import { loadDataView } from '../loadDataView';
import { resolveViewsDirPath } from '../utils/resolveViewsDirPath';

/**
 * Loads a workspace's data views from its data views directory into
 * the workspace's store record.
 *
 * @param workspace - The workspace whose data views to load.
 *
 * @dispatches data-views:loaded
 */
export async function loadWorkspaceDataViews(
  workspace: Workspace,
): Promise<void> {
  const viewsDirPath = resolveViewsDirPath(workspace.path);

  // Read the data view file paths, none until the workspace has views
  const viewPaths = (await Fs.exists(viewsDirPath))
    ? (await Fs.readDir(viewsDirPath)).map((entry) => entry.path)
    : [];

  // Read the data views
  const viewPromises = await Promise.all(
    viewPaths.map((path) => loadDataView(path, workspace.id)),
  );

  // Filter out null data views
  const views = viewPromises.filter((view) => view !== null);

  // Load the data views into the workspace's store record
  DataViewsStore.in(workspace.id).load(views);

  // Dispatch a data views loaded event
  Events.dispatch(DataViewsLoadedEvent, views);
}
