import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook, act } from '@minddrop/test-utils';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedTopic1,
  selectedDrop2,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useSelectionContains } from './useSelectionContains';

describe('useSelectionContains', () => {
  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  it('returns `true` if the current selection cotains the item type', () => {
    // Set some selected items, including a 'drop' item
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedTopic1]);

    // Check if the current selection contains 'drop' items
    const { result } = renderHook(() => useSelectionContains('drop'));

    // Should return `true`
    expect(result.current).toBe(true);
  });

  it('returns `false` if the current selection cotains the item type', () => {
    // Add a 'drop' item to the selection
    useSelectionStore.getState().addSelectedItems([selectedDrop1]);

    // Check if the current selection contains 'topic' items
    const { result } = renderHook(() => useSelectionContains('topic'));

    // Should return `false`
    expect(result.current).toBe(false);
  });

  it('returns `false` if the selection is empty', () => {
    // Check if the current (empty) selection contains 'topic' items
    const { result } = renderHook(() => useSelectionContains('topic'));

    // Should return `false`
    expect(result.current).toBe(false);
  });

  describe('exclusive', () => {
    it('returns `false` if the current selection cotains other item types', () => {
      // Add a 'drop' and a 'topic' item to the selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedDrop1, selectedTopic1]);

      // Check if the current selection contains only 'topic' items
      const { result } = renderHook(() => useSelectionContains('topic', true));

      // Should return `false`
      expect(result.current).toBe(false);
    });

    it('returns `true` if the current selection cotains no other item types', () => {
      // Add a couple of 'drop' items to the selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedDrop1, selectedDrop2]);

      // Check if the current selection contains only 'drop' items
      const { result } = renderHook(() => useSelectionContains('drop', true));

      // Should return `true`
      expect(result.current).toBe(true);
    });

    it('returns `false` if the selection is empty', () => {
      // Check if the current (empty) selection contains 'topic' items
      const { result } = renderHook(() => useSelectionContains('topic', true));

      // Should return `false`
      expect(result.current).toBe(false);
    });
  });
});
