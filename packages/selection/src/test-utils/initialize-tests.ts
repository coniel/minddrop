import { initializeCore } from '@minddrop/core';
import { useSelectionStore } from '../useSelectionStore';

export const core = initializeCore({
  extensionId: 'minddrop:selection',
});

export function setup() {
  //
}

export function cleanup() {
  // Clear the state
  useSelectionStore.getState().clear();
}
