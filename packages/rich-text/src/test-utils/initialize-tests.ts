import { initializeCore } from '@minddrop/core';
import { registerRichTextElementType } from '../registerRichTextElementType';
import { useRichTextStore } from '../useRichTextStore';
import { richTextElementConfigs, richTextElements } from './rich-text.data';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register test rich text element types
  richTextElementConfigs.forEach((config) => {
    registerRichTextElementType(core, config);
  });

  // Load rich text elements into the store
  useRichTextStore.getState().loadElements(richTextElements);
}

export function cleanup() {
  // Clear the rich text store
  useRichTextStore.getState().clear();
}
