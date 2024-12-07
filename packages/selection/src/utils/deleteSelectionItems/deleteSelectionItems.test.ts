import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectionItemTypeConfig,
  alternativeTypeItem,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import {
  registerSelectionItemType,
  unregisterSelectionItemType,
} from '../../SelectionItemTypeConfigsStore';
import { SelectionItemTypeNotRegisteredError } from '../../errors';
import { deleteSelectionItems } from './deleteSelectionItems';

const onDelete = vi.fn();

describe('deleteSelectionItems', () => {
  beforeEach(() => {
    setup();

    // Register a serializer
    registerSelectionItemType({ ...selectionItemTypeConfig, onDelete });

    // Add items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem2]);
  });

  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('calls the appropriate selection delete callback', () => {
    deleteSelectionItems();

    expect(onDelete).toHaveBeenCalledWith([selectedItem1, selectedItem2]);
  });

  it('uses the first selection item to decide the type of the selection', () => {
    // Add an item of a new type to the selection
    useSelectionStore.getState().addSelectedItems([alternativeTypeItem]);

    deleteSelectionItems();

    expect(onDelete).toHaveBeenCalledWith([selectedItem1, selectedItem2]);
  });

  it('clears the selection', () => {
    deleteSelectionItems();

    expect(useSelectionStore.getState().selectedItems).toEqual([]);
  });

  it('throws if no matching item type config is found', () => {
    // Remove the registered serializer
    unregisterSelectionItemType(selectionItemTypeConfig.id);

    expect(() => deleteSelectionItems()).toThrow(
      SelectionItemTypeNotRegisteredError,
    );
  });
});
