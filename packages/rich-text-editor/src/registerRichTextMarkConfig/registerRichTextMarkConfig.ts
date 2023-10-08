import { Events } from '@minddrop/events';
import { RichTextMarkConfigsStore } from '../RichTextMarkConfigsStore';
import { RichTextMarkConfig } from '../types';

/**
 * Registers a new RichTextMarkConfig and dispatches a
 * 'rich-text-editor:mark:register' event.
 *
 * @param config - The config to register.
 */
export function registerRichTextMarkConfig(config: RichTextMarkConfig): void {
  // Add the config to the RichTextMarkConfigsStore,
  // using the key as its ID.
  const registeredConfig = { ...config, id: config.key };

  RichTextMarkConfigsStore.set(registeredConfig);

  // Dispatch a 'rich-text-editor:mark:register' event
  Events.dispatch('rich-text-editor:mark:register', registeredConfig);
}
