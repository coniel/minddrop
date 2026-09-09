import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'desktop-app:workspace-switch';

/**
 * Registers the event listeners that reload the app when the workspace
 * it is running on changes: another workspace is made active, or the
 * active one's directory moves. Every package derives its state from
 * the active workspace as it initializes, so the boot path is what
 * loads the workspace as it now stands.
 *
 * @param stopWatcher - Stops the file system watcher of the workspace being left.
 * @returns A cleanup function that removes the listeners.
 */
export function registerWorkspaceSwitchListener(
  stopWatcher: VoidFunction,
): VoidFunction {
  function reload() {
    // The watcher lives in the Bun process and does not survive the
    // reload, so it is stopped rather than left watching a directory
    // the app has moved on from.
    stopWatcher();

    window.location.reload();
  }

  Events.addListener(Workspaces.events.ActiveChanged, LISTENER_ID, reload);

  // Renaming a workspace moves its directory, leaving every path the
  // session derived from the old one pointing nowhere.
  Events.addListener(Workspaces.events.Updated, LISTENER_ID, (update) => {
    const movedDirectory = update.original.path !== update.updated.path;
    const isActive = update.updated.id === Workspaces.getActive(false)?.id;

    if (movedDirectory && isActive) {
      reload();
    }
  });

  return () => {
    Events.removeListener(Workspaces.events.ActiveChanged, LISTENER_ID);
    Events.removeListener(Workspaces.events.Updated, LISTENER_ID);
  };
}
