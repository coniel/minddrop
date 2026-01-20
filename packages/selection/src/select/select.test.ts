import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectionItem1,
  selectionItem2,
  selectionItem3,
  setup,
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
      .addSelectedItems([selectionItem1, selectionItem2]);

    // Select an item
    select([selectionItem3]);

    // Get the current selection
    const selection = useSelectionStore.getState().selectedItems;

    // Previously selected items should no
    // longer be in the selection.
    expect(containsSelectionItem(selection, selectionItem1)).toBeFalsy();
    expect(containsSelectionItem(selection, selectionItem2)).toBeFalsy();
  });

  it('clears the current selection', () => {
    // Add an of item to the selection
    useSelectionStore.getState().addSelectedItems([selectionItem1]);

    // Select a couple of items
    select([selectionItem3, selectionItem1]);

    // Get the current selection
    const selection = useSelectionStore.getState().selectedItems;

    // Items should be in the selection
    expect(containsSelectionItem(selection, selectionItem3)).toBeTruthy();
    expect(containsSelectionItem(selection, selectionItem1)).toBeTruthy();
  });
});
