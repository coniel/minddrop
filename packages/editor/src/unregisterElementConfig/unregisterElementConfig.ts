import { Events } from '@minddrop/events';
import { ElementConfigsStore } from '../ElementConfigsStore';

/**
 * Unregisters a ElementConfig and dispatches a
 * 'editor:element:unregister' event.
 *
 * @param type - The type of the config to unregister.
 */
export function unregisterElementConfig(type: string): void {
  // Remove the config from the ElementConfigsStore, using
  // the type as the ID.
  ElementConfigsStore.remove(type);

  // Dispatch a 'editor:element:unregister' event
  Events.dispatch('editor:element:unregister', type);
}
