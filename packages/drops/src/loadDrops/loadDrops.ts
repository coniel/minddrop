import { Core } from '@minddrop/core';
import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Loads drops into the store and dispatches a `drops:load` event.
 *
 * @param core A MindDrop core instance.
 * @param drops The drops to load.
 */
export function loadDrops(core: Core, drops: Drop[]): void {
  // Load drops into the store
  useDropsStore.getState().loadDrops(drops);

  // Dispatch 'drops:load' event
  core.dispatch('drops:load', drops);
}
