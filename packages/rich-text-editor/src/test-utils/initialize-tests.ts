import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  RTDocuments,
  RTElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { useRichTextEditorStore } from '../useRichTextEditorStore';

const { richTextElementConfigs, richTextElements, richTextDocuments } =
  RICH_TEXT_TEST_DATA;

export const core = initializeCore({
  appId: 'app',
  extensionId: 'rich-text-editor',
});

export function setup() {
  act(() => {
    // Register element types
    richTextElementConfigs.forEach((config) => {
      RTElements.register(core, config);
    });

    // Load rich text elements
    RTElements.load(core, richTextElements);

    // Load rich text documents
    RTDocuments.load(core, richTextDocuments);
  });
}

export function cleanup() {
  act(() => {
    // Clear registered rich text element types
    RTElements.clearRegistered();

    // Clear rich text elements
    RTElements.clearElements();

    // Clear rich text documents
    RTDocuments.clear();

    // Clear all mock functions
    jest.clearAllMocks();

    // Clear the rich text editor store
    useRichTextEditorStore.getState().clear();
  });

  // React testing library cleanup
  cleanupRender();
}
