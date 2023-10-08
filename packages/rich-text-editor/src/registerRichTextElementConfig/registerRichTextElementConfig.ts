import { Events } from '@minddrop/events';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';
import { RichTextElementConfig } from '../types';

/**
 * Registers a new RichTextElementConfig and dispatches a
 * 'rich-text-editor:element:register' event.
 *
 * @param config - The config to register.
 */
export function registerRichTextElementConfig(
  config: RichTextElementConfig<any>,
): void {
  // Add the config to the RichTextElementConfigsStore,
  // using the type as its ID.
  const registeredConfig = { ...config, id: config.type };

  RichTextElementConfigsStore.set(registeredConfig);

  // Dispatch a 'rich-text-editor:element:register' event
  Events.dispatch('rich-text-editor:element:register', registeredConfig);
}
