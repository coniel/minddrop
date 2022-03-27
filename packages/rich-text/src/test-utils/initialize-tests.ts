import { initializeCore } from '@minddrop/core';
import { useRichTextStore } from '../useRichTextStore';

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export function setup() {}

export function cleanup() {
  // Clear the rich text store
  useRichTextStore.getState().clear();
}
