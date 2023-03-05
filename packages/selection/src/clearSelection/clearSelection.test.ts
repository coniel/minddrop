import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
  core,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { clearSelection } from './clearSelection';

describe('clearSelection', () => {
  beforeEach(() => {
    setup();

    // Add some items to the selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedDrop2, selectedTopic1]);
    // Set `isDragging` to true
    useSelectionStore.getState().setIsDragging(true);
  });

  afterEach(cleanup);

  it('clears the selected items list', () => {
    // Clear selection
    clearSelection(core);

    // Selection should be empty
    expect(useSelectionStore.getState().selectedItems).toEqual([]);
  });

  it('resets the dragging state', () => {
    // Clear selection
    clearSelection(core);

    // Should set `isDragging` to false
    expect(useSelectionStore.getState().isDragging).toBe(false);
  });
});
