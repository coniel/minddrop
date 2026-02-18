import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import {
  cleanup,
  selectionItem_A_1,
  selectionItem_A_2,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
import { useSelection } from './useSelection';

describe('useSelection', () => {
  beforeEach(() => {
    setup();

    // Add an item to the selection
    SelectionStore.getState().addSelectedItems([selectionItem_A_1]);
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
      SelectionStore.getState().addSelectedItems([selectionItem_A_2]);
    });

    // Should return the current selection
    expect(result.current).toEqual([selectionItem_A_1, selectionItem_A_2]);
  });
});
