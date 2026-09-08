import { registerAppConfigStoreListeners } from '../registerAppConfigStoreListeners';
import { registerAppWorkspaceConfigStoreListeners } from '../registerAppWorkspaceConfigStoreListeners';
import { registerWorkspaceConfigStoreListeners } from '../registerWorkspaceConfigStoreListeners';

/**
 * Registers the event listeners that persist and hydrate stores,
 * one per persist target, making this the platform layer the stores
 * package dispatches to.
 *
 * The workspace scoped targets resolve their directory when an event
 * for them arrives rather than at registration, so this can be called
 * before a workspace is loaded.
 *
 * @returns A cleanup function that removes the listeners.
 */
export function initializeStorePersistence(): VoidFunction {
  const removeListeners = [
    registerAppConfigStoreListeners(),
    registerWorkspaceConfigStoreListeners(),
    registerAppWorkspaceConfigStoreListeners(),
  ];

  return () => {
    removeListeners.forEach((removeListener) => removeListener());
  };
}
