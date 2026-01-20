import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import { dragEnd } from '../dragEnd';
import { dragStart } from '../dragStart';
import { cleanup, selectionItem1, selectionItem2, setup } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useDraggable } from './useDraggable';

vi.mock('../dragStart', () => ({ dragStart: vi.fn() }));
vi.mock('../dragEnd', () => ({ dragEnd: vi.fn() }));

describe('useDraggable', () => {
  let selectionEventData: Record<string, string> = {};
  const dragEvent = {
    stopPropagation: vi.fn(),
    dataTransfer: {
      setData: (key: string, value: string) => {
        selectionEventData[key] = value;
      },
    },
  } as unknown as React.DragEvent;

  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });

    // Reset the drag event data
    selectionEventData = {};
    // Clear mocks
    vi.clearAllMocks();
  });

  function init() {
    return renderHook(() => useDraggable(selectionItem1));
  }

  describe('onDragStart', () => {
    it('exclusively selects the item if not already selected', () => {
      // Set an item as the current selection
      useSelectionStore.getState().addSelectedItems([selectionItem2]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Selection should only contain the target item
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectionItem1,
      ]);
    });

    it('preserves current selection if the item is not already selected and Shift key is pressed', () => {
      // Set an item as the current selection
      useSelectionStore.getState().addSelectedItems([selectionItem2]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback with the
        // Shift key pressed.
        result.current.onDragStart({
          ...dragEvent,
          shiftKey: true,
        });
      });

      // Selection should contain the original selection
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectionItem2,
        selectionItem1,
      ]);
    });

    it('preserves current selection if the item is already selected', () => {
      // Set a couple of items as the current selection,
      // including the target item.
      useSelectionStore
        .getState()
        .addSelectedItems([selectionItem1, selectionItem2]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Selection should contain the original selection
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectionItem1,
        selectionItem2,
      ]);
    });

    it('initializes the drag', () => {
      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Should initialize the drag with `dragStart`
      expect(dragStart).toHaveBeenCalledWith(dragEvent, 'sort');
    });
  });

  describe('onDragEnd', () => {
    it('ends the drag', () => {
      const { result } = init();

      act(() => {
        // Fire the 'onDragEnd' callback
        result.current.onDragEnd(dragEvent);
      });

      // Should end the drag with `dragEnd`
      expect(dragEnd).toHaveBeenCalledWith(dragEvent);
    });
  });
});
