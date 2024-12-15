import { Events } from '@minddrop/events';
import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';

/**
 * Unregisters a element type config from the store.
 *
 * @param type - The element type of the config to unregister.
 * @dispatches markdown:element:unregister
 */
export function unregisterElementTypeConfig(type: string): void {
  // Remove the config from the ElementTypeConfigsStore
  ElementTypeConfigsStore.remove(type);

  // Dispatch a 'markdown:element:unregister' event
  Events.dispatch('markdown:element:unregister', type);
}
