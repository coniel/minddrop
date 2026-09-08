import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';

const LISTENER_ID = 'desktop-app:workspace-switch';

/**
 * Registers an event listener that reloads the app when the active
 * workspace changes. Every package derives its state from the active
 * workspace as it initializes, so the boot path is what loads the
 * workspace being switched to.
 *
 * @param stopWatcher - Stops the file system watcher of the workspace being left.
 * @returns A cleanup function that removes the listener.
 */
export function registerWorkspaceSwitchListener(
  stopWatcher: VoidFunction,
): VoidFunction {
  Events.addListener(Workspaces.events.ActiveChanged, LISTENER_ID, () => {
    // The watcher lives in the Bun process and does not survive the
    // reload, so it is stopped rather than left watching a workspace
    // the app has moved on from.
    stopWatcher();

    window.location.reload();
  });

  return () => {
    Events.removeListener(Workspaces.events.ActiveChanged, LISTENER_ID);
  };
}
