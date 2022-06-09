import { initializeCore } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { RTDocumentsResource } from '../RTDocumentsResource';
import { RTElementsResource } from '../RTElementsResource';
import {
  richTextDocuments,
  richTextElementConfigs,
  richTextElements,
} from './rich-text.data';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register the rich text elements resource
  Resources.register(core, RTElementsResource);
  // Register the rich text documents resource
  Resources.register(core, RTDocumentsResource);

  // Register test rich text element types
  richTextElementConfigs.forEach((config) =>
    RTElementsResource.register(core, config),
  );

  // Load test rich text documents
  RTDocumentsResource.store.load(core, richTextDocuments);

  // Load test rich text elements
  RTElementsResource.store.load(core, richTextElements);
}

export function cleanup() {
  // Unegister the rich text elements resource
  Resources.unregister(core, RTElementsResource);
  // Unegister the rich text documents resource
  Resources.unregister(core, RTDocumentsResource);

  // Clear the registered rich text element configs
  RTElementsResource.typeConfigsStore.clear();

  // Clear the rich text documents store
  RTDocumentsResource.store.clear();

  // Clear the rich text elements store
  RTElementsResource.store.clear();
}
