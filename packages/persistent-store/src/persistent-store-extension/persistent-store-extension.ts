import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { LocalStoreResource } from '../LocalStoreResource';
import { GlobalStoreResource } from '../GlobalStoreResource';

export function onRun(core: Core): void {
  // Register the 'persistent-store:local' resource
  Resources.register(core, LocalStoreResource);
  // Register the 'persistent-store:global' resource
  Resources.register(core, GlobalStoreResource);
}

export function onDisable(core: Core): void {
  // Clear registered local stores
  LocalStoreResource.typeConfigsStore.clear();
  // Clear registered global stores
  GlobalStoreResource.typeConfigsStore.clear();
  // Clear local store documents
  LocalStoreResource.store.clear();
  // Clear global store documents
  GlobalStoreResource.store.clear();

  // Unregister the 'persistent-store:local' resource
  Resources.unregister(core, LocalStoreResource);
  // Unregister the 'persistent-store:global' resource
  Resources.unregister(core, GlobalStoreResource);

  // Remove all event listeners added by this extension
  core.removeAllEventListeners();
}
