import { initializeCore } from '@minddrop/core';
import { registerRichTextElementType } from '../registerRichTextElementType';
import { useRichTextStore } from '../useRichTextStore';
import { richTextElementConfigs } from './rich-text.data';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register test element types
  richTextElementConfigs.forEach((config) => {
    registerRichTextElementType(core, config);
  });
}

export function cleanup() {
  // Clear the rich text store
  useRichTextStore.getState().clear();
}
