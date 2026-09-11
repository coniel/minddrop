import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

interface WorkspaceScopeState {
  /**
   * The ID of the workspace scoped stores currently read and write,
   * or null when no workspace is active.
   */
  workspaceId: string | null;
}

// Which workspace is active is decided above this package, which only
// needs to know the ID, so it is handed in rather than looked up.
const workspaceScopeStore = createStore<WorkspaceScopeState>(() => ({
  workspaceId: null,
}));

/**
 * Sets the workspace whose records scoped stores read and write.
 *
 * @param workspaceId - The ID of the active workspace, or null when none is active.
 */
export function setActiveWorkspaceScope(workspaceId: string | null): void {
  workspaceScopeStore.setState({ workspaceId });
}

/**
 * Returns the ID of the workspace whose records scoped stores read
 * and write, or null when no workspace is active.
 */
export function getActiveWorkspaceScope(): string | null {
  return workspaceScopeStore.getState().workspaceId;
}

/**
 * A hook which returns the ID of the workspace whose records scoped
 * stores read and write, or null when no workspace is active.
 */
export function useActiveWorkspaceScope(): string | null {
  return useStore(workspaceScopeStore, (state) => state.workspaceId);
}

/**
 * Calls the callback whenever the active workspace scope changes.
 *
 * @param callback - Called with the new workspace ID.
 * @returns A callback which stops listening.
 */
export function subscribeToActiveWorkspaceScope(
  callback: (workspaceId: string | null) => void,
): VoidFunction {
  return workspaceScopeStore.subscribe((state, previous) => {
    if (state.workspaceId !== previous.workspaceId) {
      callback(state.workspaceId);
    }
  });
}
