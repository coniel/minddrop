import { Core } from '@minddrop/core';
import { DropTypeNotRegisteredError } from '../errors';
import { useDropsStore } from '../useDropsStore';

/**
 * Unregisters a drop type and dispatches a `drops:unregister` event.
 *
 * @param core A MindDrop core instance.
 * @param type The type of drop to unregister.
 */
export function unregisterDropType(core: Core, type: string): void {
  const config = useDropsStore
    .getState()
    .registered.find((c) => c.type === type);

  if (!config) {
    throw new DropTypeNotRegisteredError(type);
  }

  useDropsStore.getState().unregisterDropType(type);

  core.dispatch('drops:unregister', config);
}
