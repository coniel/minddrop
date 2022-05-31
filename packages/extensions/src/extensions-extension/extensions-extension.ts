import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { ExtensionsResource } from '../ExtensionsResource';
import { ExtensionConfigsStore } from '../ExtensionConfigsStore';

export function onRun(core: Core): void {
  // Register the 'extensions:document' resource which
  // stores extension state and configuration.
  Resources.register(core, ExtensionsResource);
}

export function onDisable(core: Core): void {
  // Clear the extension configs store
  ExtensionConfigsStore.clear();

  // Clear extensions resource store
  ExtensionsResource.store.clear();

  // Unregister the 'extensions:document' resource
  Resources.unregister(core, ExtensionsResource);

  // Clear all event listeners
  core.removeAllEventListeners();
}
