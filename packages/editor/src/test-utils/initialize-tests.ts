import { vi } from 'vitest';
import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { EditorInlineElementConfigsStore } from '../InlineElementTypeConfigsStore';
import { MarkConfigsStore } from '../MarkConfigsStore';
import { defaultMarkConfigs } from '../default-mark-configs';
import { registerMarkConfig } from '../registerMarkConfig';
import { blockElementConfigs, inlineElementConfigs } from './editor.data';

export function setup() {
  act(() => {
    // Register element types
    blockElementConfigs.forEach((config) => {
      EditorBlockElementConfigsStore.add(config);
    });

    inlineElementConfigs.forEach((config) => {
      EditorInlineElementConfigsStore.add(config);
    });

    // Register marks
    defaultMarkConfigs.forEach((config) => registerMarkConfig(config));
  });
}

export function cleanup() {
  // React testing library cleanup
  cleanupRender();

  act(() => {
    // Clear all mock functions
    vi.clearAllMocks();

    // Clear registered elements
    EditorBlockElementConfigsStore.clear();
    EditorInlineElementConfigsStore.clear();

    // Clear registered marks
    MarkConfigsStore.clear();
  });
}
