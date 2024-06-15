import { Events } from '@minddrop/events';
import { ElementConfigsStore } from '../ElementConfigsStore';
import { EditorBlockElementConfig, EditorInlineElementConfig } from '../types';

/**
 * Registers a new ElementConfig and dispatches a
 * 'editor:element:register' event.
 *
 * @param config - The config to register.
 */
export function registerElementConfig(
  config: EditorBlockElementConfig<any> | EditorInlineElementConfig<any>,
): void {
  // Add the config to the ElementConfigsStore,
  // using the type as its ID.
  const registeredConfig = { ...config, id: config.type };

  ElementConfigsStore.set(registeredConfig);

  // Dispatch a 'editor:element:register' event
  Events.dispatch('editor:element:register', registeredConfig);
}
