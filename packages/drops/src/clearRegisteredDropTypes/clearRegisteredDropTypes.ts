import { Core } from '@minddrop/core';
import { useDropsStore } from '../useDropsStore';

/**
 * Clears registered drop types from the store and dispatches
 * a `drops:clear-register` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearRegisteredDropTypes(core: Core): void {
  // Clear registered drop types from the store
  useDropsStore.getState().clearRegistered();

  // Dispatch 'drops:clear-register' event
  core.dispatch('drops:clear-register');
}
