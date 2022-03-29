import { initializeCore } from '@minddrop/core';
import { Files, FILES_TEST_DATA } from '@minddrop/files';
import { registerRichTextElementType } from '../registerRichTextElementType';
import { useRichTextStore } from '../useRichTextStore';
import {
  richTextDocuments,
  richTextElementConfigs,
  richTextElements,
} from './rich-text.data';

const { imageFileRef } = FILES_TEST_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register test rich text element types
  richTextElementConfigs.forEach((config) => {
    registerRichTextElementType(core, config);
  });

  // Load file references
  Files.load(core, [imageFileRef]);

  // Load rich text elements into the store
  useRichTextStore.getState().loadElements(richTextElements);

  // Load rich text documents into the store
  useRichTextStore.getState().loadDocuments(richTextDocuments);
}

export function cleanup() {
  // Clear the rich text store
  useRichTextStore.getState().clear();
}
