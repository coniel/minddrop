import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook, act } from '@minddrop/test-utils';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedDrop2,
  selectedTopic1,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useSelection } from './useSelection';

describe('useSelection', () => {
  beforeEach(() => {
    setup();

    // Add an item to the selection
    useSelectionStore.getState().addSelectedItems([selectedDrop1]);
  });

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  it('returns the current selection', () => {
    // Get the current selection
    const { result } = renderHook(() => useSelection());

    act(() => {
      // Add an item to the selection
      useSelectionStore.getState().addSelectedItems([selectedDrop2]);
    });

    // Should return the current selection
    expect(result.current).toEqual([selectedDrop1, selectedDrop2]);
  });

  it('filters selection by item type', () => {
    // Add a 'topic' item to the selection
    useSelectionStore.getState().addSelectedItems([selectedTopic1]);

    // Get the current selection, filtering for the
    // 'topic' item type.
    const { result } = renderHook(() => useSelection('topic'));

    // Should return the current selection
    expect(result.current).toEqual([selectedTopic1]);
  });
});
