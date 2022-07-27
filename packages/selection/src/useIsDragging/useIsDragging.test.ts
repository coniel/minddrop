import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
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
});
