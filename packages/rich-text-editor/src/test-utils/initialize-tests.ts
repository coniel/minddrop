import { initializeCore } from '@minddrop/core';
import { RichTextElements, RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';

const { richTextElementConfigs, richTextElements } = RICH_TEXT_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {
  // Register element types
  richTextElementConfigs.forEach((config) => {
    RichTextElements.register(core, config);
  });

  // Load elements
  RichTextElements.load(core, richTextElements);
}

export function cleanup() {
  // Clear registered rich text element types
  RichTextElements.clearRegistered();

  // Clear rich text elements
  RichTextElements.clearElements();
}
