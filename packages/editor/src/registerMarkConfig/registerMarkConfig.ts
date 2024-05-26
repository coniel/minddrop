import { Events } from '@minddrop/events';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { MarkConfig } from '../types';

/**
 * Registers a new MarkConfig and dispatches a
 * 'editor:mark:register' event.
 *
 * @param config - The config to register.
 */
export function registerMarkConfig(config: MarkConfig): void {
  // Add the config to the MarkConfigsStore,
  // using the key as its ID.
  const registeredConfig = { ...config, id: config.key };

  MarkConfigsStore.set(registeredConfig);

  // Dispatch a 'editor:mark:register' event
  Events.dispatch('editor:mark:register', registeredConfig);
}
