import { Events } from '@minddrop/events';
import { RichTextMarkConfigsStore } from '../RichTextMarkConfigsStore';

/**
 * Unregisters a RichTextMarkConfig and dispatches a
 * 'rich-text-editor:mark:unregister' event.
 *
 * @param key - The key of the config to unregister.
 */
export function unregisterRichTextMarkConfig(key: string): void {
  // Remove the config from the RichTextMarkConfigsStore,
  // using the type as the ID.
  RichTextMarkConfigsStore.remove(key);

  // Dispatch a 'rich-text-editor:mark:unregister' event
  Events.dispatch('rich-text-editor:mark:unregister', key);
}
