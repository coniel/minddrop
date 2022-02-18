import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { act, renderHook } from '@minddrop/test-utils';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedTopics } from '../getSelectedTopics';
import { selectTopics } from '../selectTopics';
import { useSelectableTopic } from './useSelectableTopic';
import React from 'react';

const { tSailing, tAnchoring, tBoats } = TOPICS_TEST_DATA;

describe('useSelectableTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the topic selected state', () => {
    const { result } = renderHook(() => useSelectableTopic(tSailing.id));

    // Not selected
    expect(result.current.isSelected).toBe(false);

    // Select the topic
    act(() => {
      selectTopics(core, [tSailing.id]);
    });

    // Should be selected
    expect(result.current.isSelected).toBe(true);
  });

  it('selects the topic', () => {
    const { result } = renderHook(() => useSelectableTopic(tSailing.id));

    act(() => {
      // Select the topic
      result.current.select();
    });

    // Should be selected
    expect(result.current.isSelected).toBe(true);
  });

  it('unselects the topic', () => {
    const { result } = renderHook(() => useSelectableTopic(tSailing.id));

    act(() => {
      // Select the topic
      result.current.select();
      // Unselect the topic
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

    it('clears selected topics and selects the topic', () => {
      const { result } = renderHook(() => useSelectableTopic(tSailing.id));

      act(() => {
        // Select other topics
        selectTopics(core, [tAnchoring.id, tBoats.id]);
        // Click the topic
        result.current.onClick(clickEvent);
      });

      // Clicked topic should be selected
      expect(result.current.isSelected).toBe(true);
      // Other topics should not be selected
      let selected = getSelectedTopics();
      expect(selected[tAnchoring.id]).not.toBeDefined();
      expect(selected[tBoats.id]).not.toBeDefined();

      // Should work if topic is already selected
      act(() => {
        // Select other topics as well as this one
        selectTopics(core, [tSailing.id, tAnchoring.id, tBoats.id]);
        // Click the topic
        result.current.onClick(clickEvent);
      });

      // Clicked topic should be selected
      expect(result.current.isSelected).toBe(true);
      // Other topics should not be selected
      selected = getSelectedTopics();
      expect(selected[tAnchoring.id]).not.toBeDefined();
      expect(selected[tBoats.id]).not.toBeDefined();
    });

    it('toggles the selection if Shift key is pressed', () => {
      const { result } = renderHook(() => useSelectableTopic(tSailing.id));

      act(() => {
        // Select other topics
        selectTopics(core, [tAnchoring.id, tBoats.id]);
        // Shift click the topic
        result.current.onClick(shiftClickEvent);
      });

      // Should be selected
      expect(result.current.isSelected).toBe(true);
      // Other topics should still be selected
      let selected = getSelectedTopics();
      expect(selected[tAnchoring.id]).toBeDefined();
      expect(selected[tBoats.id]).toBeDefined();

      act(() => {
        // Shift click the topic again
        result.current.onClick(shiftClickEvent);
      });

      // Should no longer be selected
      expect(result.current.isSelected).toBe(false);
      // Other topics should still be selected
      selected = getSelectedTopics();
      expect(selected[tAnchoring.id]).toBeDefined();
      expect(selected[tBoats.id]).toBeDefined();
    });
  });
});
