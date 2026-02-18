import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { act, renderHook } from '@minddrop/test-utils';
import {
  SelectionDragEndedEvent,
  SelectionDragEndedEventData,
  SelectionDragStartedEvent,
  SelectionDragStartedEventData,
} from '../events';
import {
  cleanup,
  selectionItem_A_1 as draggedItem,
  selectionItem_A_2,
  serializedSelectionItem_A_1,
  setup,
} from '../test-utils';
import { SelectionStore } from '../useSelectionStore';
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
    cleanup();

    // Reset the drag event data
    selectionEventData = {};
  });

  function init() {
    return renderHook(() => useDraggable(draggedItem));
  }

  describe('onDragStart', () => {
    it('exclusively selects the item if not already selected', () => {
      // Set an item as the current selection
      SelectionStore.getState().addSelectedItems([selectionItem_A_2]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Selection should only contain the target item
      expect(SelectionStore.getState().selectedItems).toEqual([draggedItem]);
    });

    it('preserves current selection if the item is not already selected and Shift key is pressed', () => {
      // Set an item as the current selection
      SelectionStore.getState().addSelectedItems([selectionItem_A_2]);

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
      expect(SelectionStore.getState().selectedItems).toEqual([
        selectionItem_A_2,
        draggedItem,
      ]);
    });

    it('preserves current selection if the item is already selected', () => {
      // Set a couple of items as the current selection,
      // including the target item.
      SelectionStore.getState().addSelectedItems([
        draggedItem,
        selectionItem_A_2,
      ]);

      const { result } = init();

      act(() => {
        // Fire the 'onDragStart' callback
        result.current.onDragStart(dragEvent);
      });

      // Selection should contain the original selection
      expect(SelectionStore.getState().selectedItems).toEqual([
        draggedItem,
        selectionItem_A_2,
      ]);
    });

    it('sets the selected items data on the data transfer object', () => {
      const { result } = init();

      // Initiate a drag
      result.current.onDragStart(dragEvent);

      expect(selectionEventData).toEqual(serializedSelectionItem_A_1);
    });

    it('sets dragging state to true', () => {
      const { result } = init();

      // Initiate a drag
      result.current.onDragStart(dragEvent);

      // Should set `isDragging` to `true`
      expect(SelectionStore.getState().isDragging).toBe(true);
    });

    it('dispatches a drag started event', () =>
      new Promise<void>((done) => {
        // Listen to 'selection:drag:start' events
        Events.addListener<SelectionDragStartedEventData>(
          SelectionDragStartedEvent,
          'test',
          (payload) => {
            // Payload data should contain the event
            expect(payload.data.event).toEqual(dragEvent);
            // Payload data should contain the selection
            expect(payload.data.selection).toEqual([draggedItem]);
            done();
          },
        );

        const { result } = init();

        // Initiate a drag
        result.current.onDragStart(dragEvent);
      }));
  });

  describe('onDragEnd', () => {
    it('sets the dragging state to false', () => {
      const { result } = init();

      // Initiate a drag
      result.current.onDragStart(dragEvent);
      // End the drag
      result.current.onDragEnd(dragEvent);

      // Should set `isDragging` to `false`
      expect(SelectionStore.getState().isDragging).toBe(false);
    });

    it('dispatches a drag ended event', () =>
      new Promise<void>((done) => {
        // Listen to 'selection:drag:end' events
        Events.addListener<SelectionDragEndedEventData>(
          SelectionDragEndedEvent,
          'test',
          (payload) => {
            // Payload data should contain the event
            expect(payload.data.event).toEqual(dragEvent);
            // Payload data should contain the selection
            expect(payload.data.selection).toEqual([draggedItem]);
            done();
          },
        );

        const { result } = init();

        // Initiate a drag
        result.current.onDragStart(dragEvent);
        // End the drag
        result.current.onDragEnd(dragEvent);
      }));
  });
});
