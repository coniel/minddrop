import { Core } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { RTDocumentsResource } from '../RTDocumentsResource';
import { RTElementsResource } from '../RTElementsResource';

export function onRun(core: Core): void {
  // Register the 'rich-text:element' resource which stores
  // rich text elements
  Resources.register(core, RTElementsResource);
  //
  // Register the 'rich-text:document' resource which stores
  // rich text documents
  Resources.register(core, RTDocumentsResource);
}

export function onDisable(core: Core): void {
  // Clear registered element types
  RTElementsResource.typeConfigsStore.clear();
  // Clear rich text elements
  RTElementsResource.store.clear();
  // Clear rich text documents
  RTDocumentsResource.store.clear();

  // Unregsiter the 'rich-text:elements' resource
  Resources.unregister(core, RTElementsResource);
  // Unregsiter the 'rich-text:document' resource
  Resources.unregister(core, RTDocumentsResource);

  // Remove all event listeners added by this extension
  core.removeAllEventListeners();
}
