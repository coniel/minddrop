import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  RichTextDocuments,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import * as RichTextExtension from '@minddrop/rich-text';
import { useRichTextEditorStore } from '../useRichTextEditorStore';

const { richTextElementConfigs, richTextElements, richTextDocuments } =
  RICH_TEXT_TEST_DATA;

export const core = initializeCore({
  appId: 'app',
  extensionId: 'rich-text-editor',
});

export function setup() {
  act(() => {
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
  });
}

export function cleanup() {
  act(() => {
    // Disable the rich text extension
    RichTextExtension.onDisable(core);

    // Clear all mock functions
    jest.clearAllMocks();

    // Clear the rich text editor store
    useRichTextEditorStore.getState().clear();
  });

  // React testing library cleanup
  cleanupRender();
}
