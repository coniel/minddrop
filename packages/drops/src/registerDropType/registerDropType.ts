import { Core } from '@minddrop/core';
import { DropConfig } from '../types/DropConfig.types';
import { useDropsStore } from '../useDropsStore';

/**
 * Registers a new drop type and dispatches a `drops:register`
 * event.
 *
 * @param core A MindDrop core instance.
 * @param config The configartion of the drop type to register.
 */
export function registerDropType(core: Core, config: DropConfig): void {
  useDropsStore.getState().registerDropType(config);

  core.dispatch('drops:register', config);
}
