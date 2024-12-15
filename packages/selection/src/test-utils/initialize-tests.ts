import { Events } from '@minddrop/events';
import { SelectionItemTypesStore } from '../SelectionItemTypeConfigsStore';
import { useSelectionStore } from '../useSelectionStore';

export function setup() {}

export function cleanup() {
  // Clear the state
  useSelectionStore.getState().clear();
  SelectionItemTypesStore.clear();

  // Clear event listeners
  Events._clearAll();
}
