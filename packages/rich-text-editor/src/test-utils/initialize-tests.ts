import { vi } from 'vitest';
import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { richTextElementConfigs } from './rich-text-editor.data';
import { registerRichTextElementConfig } from '../registerRichTextElementConfig';
import { defaultMarkConfigs } from '../default-mark-configs';
import { registerRichTextMarkConfig } from '../registerRichTextMarkConfig';
import { RichTextMarkConfigsStore } from '../RichTextMarkConfigsStore';
import { RichTextElementConfigsStore } from '../RichTextElementConfigsStore';

export const core = initializeCore({
  extensionId: 'rich-text-editor',
});

export function setup() {
  act(() => {
    // Register element types
    richTextElementConfigs.forEach((config) => {
      registerRichTextElementConfig(config);
    });

    // Register marks
    defaultMarkConfigs.forEach((config) => registerRichTextMarkConfig(config));
  });
}

export function cleanup() {
  // React testing library cleanup
  cleanupRender();

  act(() => {
    // Clear all mock functions
    vi.clearAllMocks();

    // Clear registered elements
    RichTextElementConfigsStore.clear();

    // Clear registered marks
    RichTextMarkConfigsStore.clear();
  });
}
