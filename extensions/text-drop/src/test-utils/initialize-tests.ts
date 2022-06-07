import { initializeCore } from '@minddrop/core';
import {
  RichTextDocuments,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import * as RichTextExtension from '@minddrop/rich-text';

const { richTextElementConfigs, richTextElements, richTextDocuments } =
  RICH_TEXT_TEST_DATA;

export const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop/text-drop',
});

export function setup() {
  // Run the rich text extension
  RichTextExtension.onRun(core);

  // Register element types
  richTextElementConfigs.forEach((config) => {
    RichTextElements.register(core, config);
  });

  // Load rich text elements
  RichTextElements.store.load(core, richTextElements);

  // Load rich text documents
  RichTextDocuments.store.load(core, richTextDocuments);
}

export function cleanup() {
  // Disable the rich text extension
  RichTextExtension.onDisable(core);
}
