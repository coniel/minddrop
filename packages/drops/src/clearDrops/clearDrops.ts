import { Core } from '@minddrop/core';

/**
 * Clears drops from the store by dispatching a `drops:clear` event.
 *
 * @param core A MindDrop core instance.
 */
export function clearDrops(core: Core): void {
  // Dispatch 'drops:clear' event
  core.dispatch('drops:clear');
}
