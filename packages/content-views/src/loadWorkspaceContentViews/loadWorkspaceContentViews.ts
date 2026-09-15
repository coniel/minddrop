import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspace } from '@minddrop/workspaces';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewsLoadedEvent } from '../events';
import { loadContentView } from '../loadContentView';
import { resolveContentViewsDirPath } from '../utils/resolveContentViewsDirPath';

/**
 * Loads a workspace's content views from its content views directory into
 * the workspace's store record.
 *
 * @param workspace - The workspace whose content views to load.
 *
 * @dispatches content-views:loaded
 */
export async function loadWorkspaceContentViews(
  workspace: Workspace,
): Promise<void> {
  const viewsDirPath = resolveContentViewsDirPath(workspace.path);

  // Read the content view file paths, none until the workspace has views
  const viewPaths = (await Fs.exists(viewsDirPath))
    ? (await Fs.readDir(viewsDirPath)).map((entry) => entry.path)
    : [];

  // Read the content views
  const viewPromises = await Promise.all(
    viewPaths.map((path) => loadContentView(path, workspace.id)),
  );

  // Filter out null content views
  const views = viewPromises.filter((view) => view !== null);

  // Load the content views into the workspace's store record
  ContentViewsStore.in(workspace.id).load(views);

  // Dispatch a content views loaded event
  Events.dispatch(ContentViewsLoadedEvent, views);
}
