import { Events } from '@minddrop/events';
import { ElementTypeConfigsStore } from '../ElementTypeConfigsStore';
import { ElementTypeConfig } from '../types';

/**
 * Registers a new element type config.
 *
 * @param config - The config to register.
 * @dispatches markdown:element:register
 */
export function registerElementTypeConfig(config: ElementTypeConfig): void {
  // Add the config to the store
  ElementTypeConfigsStore.add(config);

  // Dispatch a 'markdown:element:register' event
  Events.dispatch('markdown:element:register', config);
}
