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

  it('filters selection by resource type', () => {
    // Add a 'topics:topic' item to the selection
    useSelectionStore.getState().addSelectedItems([selectedTopic1]);

    // Get the current selection, filtering for the
    // 'topics:topic' resource type.
    const { result } = renderHook(() => useSelection('topics:topic'));

    // Should return the current selection
    expect(result.current).toEqual([selectedTopic1]);
  });
});
