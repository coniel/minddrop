import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { containsSelectionItem } from '../utils';
import { select } from './select';

describe('select', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears the current selection', () => {
    // Add a couple of items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem2]);

    // Select an item
    select([selectedItem3]);

    // Get the current selection
    const selection = useSelectionStore.getState().selectedItems;

    // Previously selected items should no
    // longer be in the selection.
    expect(containsSelectionItem(selection, selectedItem1)).toBeFalsy();
    expect(containsSelectionItem(selection, selectedItem2)).toBeFalsy();
  });

  it('clears the current selection', () => {
    // Add an of item to the selection
    useSelectionStore.getState().addSelectedItems([selectedItem1]);

    // Select a couple of items
    select([selectedItem3, selectedItem1]);

    // Get the current selection
    const selection = useSelectionStore.getState().selectedItems;

    // Items should be in the selection
    expect(containsSelectionItem(selection, selectedItem3)).toBeTruthy();
    expect(containsSelectionItem(selection, selectedItem1)).toBeTruthy();
  });
});
