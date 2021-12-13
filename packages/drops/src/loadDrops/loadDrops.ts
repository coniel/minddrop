import { Core } from '@minddrop/core';
import { Drop } from '../types';

/**
 * Loads drops into the store by dispatching a `drops:load` event.
 *
 * @param core A MindDrop core instance.
 * @param drops The drops to load.
 */
export function loadDrops(core: Core, drops: Drop[]): void {
  // Dispatch 'drops:load' event
  core.dispatch('drops:load', drops);
}
