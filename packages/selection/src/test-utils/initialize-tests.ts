import { Events } from '@minddrop/events';
import { useSelectionStore } from '../useSelectionStore';
import { SelectionItemTypesStore } from '../SelectionItemTypeConfigsStore';

export function setup() {}

export function cleanup() {
  // Clear the state
  useSelectionStore.getState().clear();
  SelectionItemTypesStore.clear();

  // Clear event listeners
  Events._clearAll();
}
