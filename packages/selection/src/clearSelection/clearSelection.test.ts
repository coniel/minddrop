import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
  setup,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { clearSelection } from './clearSelection';

describe('clearSelection', () => {
  beforeEach(() => {
    setup();

    // Add some items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem2, selectedItem3]);
    // Set `isDragging` to true
    useSelectionStore.getState().setIsDragging(true);
  });

  afterEach(cleanup);

  it('clears the selected items list', () => {
    // Clear selection
    clearSelection();

    // Selection should be empty
    expect(useSelectionStore.getState().selectedItems).toEqual([]);
  });

  it('resets the dragging state', () => {
    // Clear selection
    clearSelection();

    // Should set `isDragging` to false
    expect(useSelectionStore.getState().isDragging).toBe(false);
  });
});
