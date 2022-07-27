import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup, selectedDrop2, selectedDrop1 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useDraggable } from './useDraggable';
import { dragStart } from '../dragStart';
import { dragEnd } from '../dragEnd';

jest.mock('../dragStart', () => ({ dragStart: jest.fn() }));
jest.mock('../dragEnd', () => ({ dragEnd: jest.fn() }));

describe('useDraggable', () => {
  let selectionEventData: Record<string, string> = {};
  const dragEvent = {
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
    jest.clearAllMocks();
  });

  function init() {
    return renderHook(() => useDraggable(selectedDrop1));
  }

  describe('onDragStart', () => {
    it('exclusively selects the item if not already selected', () => {
      // Set an item as the current selection
      useSelectionStore.getState().addSelectedItems([selectedDrop2]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Selection should only contain the target item
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedDrop1,
      ]);
    });

    it('preserves current selection if the item is not already selected and Shift key is pressed', () => {
      // Set an item as the current selection
      useSelectionStore.getState().addSelectedItems([selectedDrop2]);

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
        selectedDrop2,
        selectedDrop1,
      ]);
    });

    it('preserves current selection if the item is already selected', () => {
      // Set a couple of items as the current selection,
      // including the target item.
      useSelectionStore
        .getState()
        .addSelectedItems([selectedDrop1, selectedDrop2]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Selection should contain the original selection
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedDrop1,
        selectedDrop2,
      ]);
    });

    it('initializes the drag', () => {
      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Should initialize the drag with `dragStart`
      expect(dragStart).toHaveBeenCalledWith(
        expect.anything(),
        dragEvent,
        'sort',
      );
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
      expect(dragEnd).toHaveBeenCalledWith(expect.anything(), dragEvent);
    });
  });
});
