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

  it('returns `true` if the current selection cotains the resource type', () => {
    // Set some selected items, including a 'drops:drop' item
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedTopic1]);

    // Check if the current selection contains 'drops:drop' items
    const { result } = renderHook(() => useSelectionContains('drops:drop'));

    // Should return `true`
    expect(result.current).toBe(true);
  });

  it('returns `false` if the current selection cotains the resource type', () => {
    // Add a 'drops:drop' resource to the selection
    useSelectionStore.getState().addSelectedItems([selectedDrop1]);

    // Check if the current selection contains 'topics:topic' items
    const { result } = renderHook(() => useSelectionContains('topics:topic'));

    // Should return `false`
    expect(result.current).toBe(false);
  });

  it('returns `false` if the selection is empty', () => {
    // Check if the current (empty) selection contains 'topics:topic' items
    const { result } = renderHook(() => useSelectionContains('topics:topic'));

    // Should return `false`
    expect(result.current).toBe(false);
  });

  describe('exclusive', () => {
    it('returns `false` if the current selection cotains other resource types', () => {
      // Add a 'drops:drop' and a 'topics:topic' resource to the selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedDrop1, selectedTopic1]);

      // Check if the current selection contains only 'topics:topic' items
      const { result } = renderHook(() =>
        useSelectionContains('topics:topic', true),
      );

      // Should return `false`
      expect(result.current).toBe(false);
    });

    it('returns `true` if the current selection cotains no other resource types', () => {
      // Add a couple of 'drops:drop' resources to the selection
      useSelectionStore
        .getState()
        .addSelectedItems([selectedDrop1, selectedDrop2]);

      // Check if the current selection contains only 'drops:drop' items
      const { result } = renderHook(() =>
        useSelectionContains('drops:drop', true),
      );

      // Should return `true`
      expect(result.current).toBe(true);
    });

    it('returns `false` if the selection is empty', () => {
      // Check if the current (empty) selection contains 'topics:topic' items
      const { result } = renderHook(() =>
        useSelectionContains('topics:topic', true),
      );

      // Should return `false`
      expect(result.current).toBe(false);
    });
  });
});
