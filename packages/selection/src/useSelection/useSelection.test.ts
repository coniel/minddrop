import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup, selectedItem1, selectedItem2 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useSelection } from './useSelection';

describe('useSelection', () => {
  beforeEach(() => {
    setup();

    // Add an item to the selection
    useSelectionStore.getState().addSelectedItems([selectedItem1]);
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
      useSelectionStore.getState().addSelectedItems([selectedItem2]);
    });

    // Should return the current selection
    expect(result.current).toEqual([selectedItem1, selectedItem2]);
  });
});
