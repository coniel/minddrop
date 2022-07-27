import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup, selectedDrop1 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useIsDragging } from './useIsDragging';

describe('useIsDragging', () => {
  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  it('returns the isDragging state', () => {
    // Get the dragging state
    const { result } = renderHook(() => useIsDragging());

    act(() => {
      // Change to dragging state to `true`
      useSelectionStore.getState().setIsDragging(true);
    });

    // Should return `true`
    expect(result.current).toBe(true);
  });

  it('checks for a specific resource', () => {
    // Check if drops are being dragged
    const { result } = renderHook(() => useIsDragging('drops:drop'));

    act(() => {
      // Change to dragging state to `true`
      useSelectionStore.getState().setIsDragging(true);
    });

    // Should return `false`
    expect(result.current).toBe(false);

    act(() => {
      // Add a drop to the selection
      useSelectionStore.getState().addSelectedItems([selectedDrop1]);
    });

    // Should return `true`
    expect(result.current).toBe(true);

    act(() => {
      // Change to dragging state to `false`
      useSelectionStore.getState().setIsDragging(false);
    });

    // Should return `false`
    expect(result.current).toBe(false);
  });
});
