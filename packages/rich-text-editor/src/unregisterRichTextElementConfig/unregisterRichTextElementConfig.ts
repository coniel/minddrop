import { Events } from '@minddrop/events';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';

/**
 * Unregisters a RichTextElementConfig and dispatches a
 * 'rich-text-editor:element:unregister' event.
 *
 * @param type - The type of the config to unregister.
 */
export function unregisterRichTextElementConfig(type: string): void {
  // Remove the config from the RichTextElementConfigsStore,
  // using the type as the ID.
  RichTextElementConfigsStore.remove(type);

  // Dispatch a 'rich-text-editor:element:unregister' event
  Events.dispatch('rich-text-editor:element:unregister', type);
}
