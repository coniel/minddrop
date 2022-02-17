import { Core } from '@minddrop/core';
import { Drop, DropConfig, RegisteredDropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Registers a new drop type and dispatches a `drops:register`
 * event.
 *
 * @param core A MindDrop core instance.
 * @param config The configartion of the drop type to register.
 */
export function registerDropType<T extends Drop = Drop>(
  core: Core,
  config: DropConfig<T>,
): void {
  const registeredConfig: RegisteredDropConfig = {
    ...config,
    extension: core.extensionId,
  };
  useDropsStore.getState().registerDropType(registeredConfig);

  core.dispatch('drops:register', registeredConfig);
}
