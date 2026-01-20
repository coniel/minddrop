import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  registerSelectionItemType,
  unregisterSelectionItemType,
} from '../../SelectionItemTypeConfigsStore';
import { SelectionItemTypeNotRegisteredError } from '../../errors';
import {
  alternativeTypeItem,
  cleanup,
  selectionItem1,
  selectionItem2,
  selectionItemTypeConfig,
  setup,
} from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
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
      .addSelectedItems([selectionItem1, selectionItem2]);
  });

  afterEach(() => {
    cleanup();

    vi.clearAllMocks();
  });

  it('calls the appropriate selection delete callback', () => {
    deleteSelectionItems();

    expect(onDelete).toHaveBeenCalledWith([selectionItem1, selectionItem2]);
  });

  it('uses the first selection item to decide the type of the selection', () => {
    // Add an item of a new type to the selection
    useSelectionStore.getState().addSelectedItems([alternativeTypeItem]);

    deleteSelectionItems();

    expect(onDelete).toHaveBeenCalledWith([selectionItem1, selectionItem2]);
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
