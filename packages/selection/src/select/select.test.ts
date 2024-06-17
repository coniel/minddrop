import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
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
      .addSelectedItems([selectedDrop1, selectedDrop2]);

    // Select an item
    select([selectedTopic1]);

    // Get the current selection
    const selection = useSelectionStore.getState().selectedItems;

    // Previously selected items should no
    // longer be in the selection.
    expect(containsSelectionItem(selection, selectedDrop1)).toBeFalsy();
    expect(containsSelectionItem(selection, selectedDrop2)).toBeFalsy();
  });

  it('clears the current selection', () => {
    // Add an of item to the selection
    useSelectionStore.getState().addSelectedItems([selectedDrop1]);

    // Select a couple of items
    select([selectedTopic1, selectedDrop1]);

    // Get the current selection
    const selection = useSelectionStore.getState().selectedItems;

    // Items should be in the selection
    expect(containsSelectionItem(selection, selectedTopic1)).toBeTruthy();
    expect(containsSelectionItem(selection, selectedDrop1)).toBeTruthy();
  });
});
