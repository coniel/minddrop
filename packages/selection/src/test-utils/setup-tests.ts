import { vi } from 'vitest';
import { Events } from '@minddrop/events';
import { SelectionItemSerializersRegistry } from '../SelectionItemSerializersRegistry';
import { SelectionStore } from '../SelectionStore';
import {
  selection,
  selectionItemSerializer_A,
  selectionItemSerializer_B,
} from './fixtures';

interface SetupOptions {
  /**
   * Whether to load test selection item serializers into the store.
   * @default true
   */
  loadSelectionItemSerializers?: boolean;

  /**
   * Whether to load a test selection into the store.
   * @default false
   */
  loadSelection?: boolean;
}

export function setup(
  options: SetupOptions = {
    loadSelectionItemSerializers: true,
    loadSelection: false,
  },
) {
  if (options.loadSelectionItemSerializers !== false) {
    // Load selection item serializers into the store
    [selectionItemSerializer_A, selectionItemSerializer_B].forEach(
      SelectionItemSerializersRegistry.register,
    );
  }

  if (options.loadSelection === true) {
    // Load selection into the store
    SelectionStore.getState().addSelectedItems(selection);
  }
}

export function cleanup() {
  // Clear the state
  SelectionStore.getState().clear();
  SelectionItemSerializersRegistry.clear();
  // Clear event listeners
  Events.tests.cleanup();
  // Clear mocks
  vi.clearAllMocks();
}
