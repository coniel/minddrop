import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspace, Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'desktop-app:workspace-watchers';

/**
 * Watches every loaded workspace's directory for changes made outside
 * the app: starts a watcher for each loaded workspace and for each
 * workspace as it loads, stops it when the workspace is removed and
 * restarts it on the new path when the workspace's directory moves.
 *
 * @returns A cleanup function that stops the watchers and removes the listeners.
 */
export function initializeWorkspaceWatchers(): VoidFunction {
  // The watchers' stop functions, keyed by workspace ID
  const watchers = new Map<string, Promise<VoidFunction>>();

  // Starts watching a workspace's directory, stopping the watcher it
  // already has once the new one has started.
  function watch(workspace: Workspace): void {
    const previous = watchers.get(workspace.id);

    watchers.set(
      workspace.id,
      Fs.startWatcher([
        { workspaceId: workspace.id, path: workspace.path },
      ]).then(async (stop) => {
        if (previous) {
          (await previous)();
        }

        return stop;
      }),
    );
  }

  // Stops watching a workspace's directory
  async function unwatch(workspaceId: string): Promise<void> {
    const watcher = watchers.get(workspaceId);

    if (!watcher) {
      return;
    }

    watchers.delete(workspaceId);
    (await watcher)();
  }

  // Watch the workspaces already loaded
  Workspaces.getLoaded().forEach(watch);

  // Watch each workspace as it loads
  Events.addListener(Workspaces.events.WorkspaceLoaded, LISTENER_ID, watch);

  // Stop watching removed workspaces
  Events.addListener(Workspaces.events.Deleted, LISTENER_ID, (workspace) => {
    unwatch(workspace.id);
  });

  // Restart the watcher on the new path when a workspace's directory
  // moves, as a rename does.
  Events.addListener(Workspaces.events.Updated, LISTENER_ID, (update) => {
    if (update.original.path !== update.updated.path) {
      watch(update.updated);
    }
  });

  return () => {
    Events.removeListener(Workspaces.events.WorkspaceLoaded, LISTENER_ID);
    Events.removeListener(Workspaces.events.Deleted, LISTENER_ID);
    Events.removeListener(Workspaces.events.Updated, LISTENER_ID);

    [...watchers.keys()].forEach(unwatch);
  };
}
