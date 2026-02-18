import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  selectionItem_B_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { containsSelectionItem } from '../utils';
import { select } from './select';

describe('select', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears the current selection', () => {
    // Add a couple of items to the selection
    SelectionStore.getState().addSelectedItems([
      selectionItem_A_1,
      selectionItem_A_2,
    ]);

    // Select an item
    select([selectionItem_B_1]);

    // Get the current selection
    const selection = SelectionStore.getState().selectedItems;

    // Previously selected items should no
    // longer be in the selection.
    expect(containsSelectionItem(selection, selectionItem_A_1)).toBeFalsy();
    expect(containsSelectionItem(selection, selectionItem_A_2)).toBeFalsy();
  });

  it('clears the current selection', () => {
    // Add an of item to the selection
    SelectionStore.getState().addSelectedItems([selectionItem_A_1]);

    // Select a couple of items
    select([selectionItem_B_1, selectionItem_A_1]);

    // Get the current selection
    const selection = SelectionStore.getState().selectedItems;

    // Items should be in the selection
    expect(containsSelectionItem(selection, selectionItem_B_1)).toBeTruthy();
    expect(containsSelectionItem(selection, selectionItem_A_1)).toBeTruthy();
  });
});
