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
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the current selection', () => {
    // Select some items
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedDrop2]);

    // Get the current selection
    const { result } = renderHook(() => useSelection());

    // Should return the current selection
    expect(result.current).toEqual([selectedDrop1, selectedDrop2]);
  });

  it('filters selection by item type', () => {
    // Select 'drop' and 'topic' items
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedTopic1]);

    // Get the current selection, filtering for the
    // 'topic' item type.
    const { result } = renderHook(() => useSelection('topic'));

    // Should return the current selection
    expect(result.current).toEqual([selectedTopic1]);
  });
});
