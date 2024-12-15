import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import { cleanup, selectedItem1, selectedItem2, setup } from '../test-utils';
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
