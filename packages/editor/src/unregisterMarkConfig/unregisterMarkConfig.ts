import { Events } from '@minddrop/events';
import { MarkConfigsStore } from '../MarkConfigsStore';

/**
 * Unregisters a MarkConfig and dispatches a
 * 'editor:mark:unregister' event.
 *
 * @param key - The key of the config to unregister.
 */
export function unregisterMarkConfig(key: string): void {
  // Remove the config from the MarkConfigsStore, using
  // the type as the ID.
  MarkConfigsStore.remove(key);

  // Dispatch a 'editor:mark:unregister' event
  Events.dispatch('editor:mark:unregister', key);
}
