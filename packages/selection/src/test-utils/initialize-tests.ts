import { Events } from '@minddrop/events';
import { useSelectionStore } from '../useSelectionStore';

export function setup() {}

export function cleanup() {
  // Clear the state
  useSelectionStore.getState().clear();

  // Clear event listeners
  Events._clearAll();
}
