import { DROPS_TEST_DATA } from '@minddrop/drops';
import { act, renderHook } from '@minddrop/test-utils';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedDrops } from '../getSelectedDrops';
import { selectDrops } from '../selectDrops';
import { useSelectableDrop } from './useSelectableDrop';
import React from 'react';
import { mapById } from '@minddrop/utils';

const { textDrop1, textDrop2, textDrop3 } = DROPS_TEST_DATA;

describe('useSelectableDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the drop selected state', () => {
    const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

    // Not selected
    expect(result.current.isSelected).toBe(false);

    // Select the drop
    act(() => {
      selectDrops(core, [textDrop1.id]);
    });

    // Should be selected
    expect(result.current.isSelected).toBe(true);
  });

  it('selects the drop', () => {
    const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

    act(() => {
      // Select the drop
      result.current.select();
    });

    // Should be selected
    expect(result.current.isSelected).toBe(true);
  });

  it('selects only the drop', () => {
    const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

    act(() => {
      // Select other drops
      selectDrops(core, [textDrop2.id, textDrop3.id]);
    });

    act(() => {
      // Select only the drop
      result.current.selectAsOnly();
    });

    // Should be the only selected drop
    expect(getSelectedDrops()).toEqual(mapById([textDrop1]));
  });

  it('unselects the drop', () => {
    const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

    act(() => {
      // Select the drop
      result.current.select();
      // Unselect the drop
      result.current.unselect();
    });

    // Should not be selected
    expect(result.current.isSelected).toBe(false);
  });

  describe('onClick', () => {
    const clickEvent = {
      stopPropagation: jest.fn(),
    } as unknown as React.MouseEvent;
    const shiftClickEvent = {
      stopPropagation: jest.fn(),
      shiftKey: true,
    } as unknown as React.MouseEvent;

    it('clears selected drops and selects the drop', () => {
      const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

      act(() => {
        // Select other drops
        selectDrops(core, [textDrop2.id, textDrop3.id]);
        // Click the drop
        result.current.onClick(clickEvent);
      });

      // Clicked drop should be selected
      expect(result.current.isSelected).toBe(true);
      // Other drops should not be selected
      let selected = getSelectedDrops();
      expect(selected[textDrop2.id]).not.toBeDefined();
      expect(selected[textDrop3.id]).not.toBeDefined();

      // Should work if drop is already selected
      act(() => {
        // Select other drops as well as this one
        selectDrops(core, [textDrop1.id, textDrop2.id, textDrop3.id]);
        // Click the drop
        result.current.onClick(clickEvent);
      });

      // Clicked drop should be selected
      expect(result.current.isSelected).toBe(true);
      // Other drops should not be selected
      selected = getSelectedDrops();
      expect(selected[textDrop2.id]).not.toBeDefined();
      expect(selected[textDrop3.id]).not.toBeDefined();
    });

    it('toggles the selection if Shift key is pressed', () => {
      const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

      act(() => {
        // Select other drops
        selectDrops(core, [textDrop2.id, textDrop3.id]);
        // Shift click the drop
        result.current.onClick(shiftClickEvent);
      });

      // Should be selected
      expect(result.current.isSelected).toBe(true);
      // Other drops should still be selected
      let selected = getSelectedDrops();
      expect(selected[textDrop2.id]).toBeDefined();
      expect(selected[textDrop3.id]).toBeDefined();

      act(() => {
        // Shift click the drop again
        result.current.onClick(shiftClickEvent);
      });

      // Should no longer be selected
      expect(result.current.isSelected).toBe(false);
      // Other drops should still be selected
      selected = getSelectedDrops();
      expect(selected[textDrop2.id]).toBeDefined();
      expect(selected[textDrop3.id]).toBeDefined();
    });
  });

  describe('selectedClass', () => {
    it('should be an empty string if drop is not selected', () => {
      const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

      // Should be an empty string
      expect(result.current.selectedClass).toBe('');
    });

    it('should be set if drop is selcted', () => {
      const { result } = renderHook(() => useSelectableDrop(textDrop1.id));

      act(() => {
        // Select the drop
        result.current.select();
      });

      // Should not be an empty string
      expect(result.current.selectedClass).not.toBe('');
    });
  });
});
