import { Core } from '@minddrop/core';
import { Extension } from '../types';
import { useExtensionsStore } from '../useExtensionsStore';

/**
 * Registers a new extension and dispatches a
 * `extensions:register` event.
 *
 * @param core A MindDrop core instance.
 * @param extension The extension to register.
 */
export function registerExtension(core: Core, extension: Extension): void {
  // Adds the extension to the store
  useExtensionsStore.getState().setExtension(extension);

  // Dispatches a 'extensions:register' event
  core.dispatch('extensions:register', extension);
}
