import { initializeCore } from '@minddrop/core';
import { useSelectionStore } from '../useSelectionStore';

export const core = initializeCore({
  appId: 'app',
  extensionId: 'minddrop:selection',
});

export function setup() {
  //
}

export function cleanup() {
  // Clear the state
  useSelectionStore.getState().clear();
}
