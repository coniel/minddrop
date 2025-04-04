import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import { cleanup, selectedItem1, selectedItem2, setup } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { useSelectable } from './useSelectable';

describe('useSelectable', () => {
  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  function init() {
    return renderHook(() => useSelectable(selectedItem1));
  }

  describe('selected', () => {
    it('returns the selected state', () => {
      const { result } = init();

      // Item is not initially selected, should return `false`
      expect(result.current.selected).toBe(false);

      act(() => {
        // At the item to the current selection
        useSelectionStore.getState().addSelectedItems([selectedItem1]);
      });

      // Item is selected, should return `true`
      expect(result.current.selected).toBe(true);
    });
  });

  describe('onClick', () => {
    const clickEvent = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent;
    const shiftClickEvent = {
      stopPropagation: vi.fn(),
      shiftKey: true,
    } as unknown as React.MouseEvent;

    describe('regular click', () => {
      it('exclusively selects the item', () => {
        // Add an initial selection
        useSelectionStore.getState().addSelectedItems([selectedItem2]);

        const { result } = init();

        act(() => {
          // Call the `onClick` callback
          result.current.onClick(clickEvent);
        });

        // Selection should only contain the item
        expect(useSelectionStore.getState().selectedItems).toEqual([
          selectedItem1,
        ]);
      });

      it('exclusively selects the item when already selected', () => {
        // Add an initial selection containing the item
        // as well as a second one.
        useSelectionStore
          .getState()
          .addSelectedItems([selectedItem1, selectedItem2]);

        const { result } = init();

        act(() => {
          // Call the `onClick` callback
          result.current.onClick(clickEvent);
        });

        // Selection should only contain the item
        expect(useSelectionStore.getState().selectedItems).toEqual([
          selectedItem1,
        ]);
      });
    });

    describe('shift click', () => {
      it('adds the item to the selection if not selected', () => {
        // Add an initial selection
        useSelectionStore.getState().addSelectedItems([selectedItem2]);

        const { result } = init();

        act(() => {
          // Call the `onClick` callback with options simulating
          // a Shift click.
          result.current.onClick(shiftClickEvent);
        });

        // Selection should contain the item as well as the
        // initial item.
        expect(useSelectionStore.getState().selectedItems).toEqual([
          selectedItem2,
          selectedItem1,
        ]);
      });

      it('removes the item from the selection if already selected', () => {
        // Add an initial selection containing the item
        // as well as a second one.
        useSelectionStore
          .getState()
          .addSelectedItems([selectedItem1, selectedItem2]);

        const { result } = init();

        act(() => {
          // Call the `onClick` callback with options simulating
          // a Shift click.
          result.current.onClick(shiftClickEvent);
        });

        // Selection should no longer contain the item but should
        // still contain the other initial item.
        expect(useSelectionStore.getState().selectedItems).toEqual([
          selectedItem2,
        ]);
      });
    });
  });

  describe('addToSelection', () => {
    it('adds the item to the selection', () => {
      // Add an initial selection
      useSelectionStore.getState().addSelectedItems([selectedItem2]);

      const { result } = init();

      act(() => {
        // Add the item to the current selection
        result.current.addToSelection();
      });

      // Selection should contain the item as well as the
      // initial item.
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedItem2,
        selectedItem1,
      ]);
    });
  });

  describe('removeFromSelection', () => {
    it('removes the item from the selection', () => {
      // Add an initial selection containing the item
      // as well as a second one.
      useSelectionStore
        .getState()
        .addSelectedItems([selectedItem1, selectedItem2]);

      const { result } = init();

      act(() => {
        // Remove the item from selection
        result.current.removeFromSelection();
      });

      // Selection should no longer contain the item but should
      // still contain the other initial item.
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedItem2,
      ]);
    });
  });

  describe('select', () => {
    it('exclusively selects the item', () => {
      // Add an initial selection
      useSelectionStore.getState().addSelectedItems([selectedItem2]);

      const { result } = init();

      act(() => {
        // Select the item
        result.current.select();
      });

      // Selection should only contain the item
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedItem1,
      ]);
    });

    it('exclusively selects the item when already selected', () => {
      // Add an initial selection containing the item
      // as well as a second one.
      useSelectionStore
        .getState()
        .addSelectedItems([selectedItem1, selectedItem2]);

      const { result } = init();

      act(() => {
        // Select the item
        result.current.select();
      });

      // Selection should only contain the item
      expect(useSelectionStore.getState().selectedItems).toEqual([
        selectedItem1,
      ]);
    });
  });

  describe('clearSelection', () => {
    it('clears the selection', () => {
      // Add selected items
      useSelectionStore
        .getState()
        .addSelectedItems([selectedItem1, selectedItem2]);

      const { result } = init();

      act(() => {
        // Clear selection
        result.current.clearSelection();
      });

      // Selection should be cleared
      expect(useSelectionStore.getState().selectedItems).toEqual([]);
    });
  });
});
