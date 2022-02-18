import React from 'react';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { act, fireEvent, render, renderHook } from '@minddrop/test-utils';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedTopics } from '../getSelectedTopics';
import { useDraggableTopic } from './useDraggableTopic';
import { createDataInsertFromDataTransfer } from '@minddrop/utils';
import { selectTopics } from '../selectTopics';
import { setDraggedTopics } from '../setDraggedTopics';

const { tSailing, tAnchoring } = TOPICS_TEST_DATA;

const dragStartEvent = {
  dataTransfer: {
    setData: jest.fn(),
  },
};

const Topic = () => {
  const { onDragStart } = useDraggableTopic(tSailing.id);

  return <div onDragStart={onDragStart} data-testid="topic" />;
};

describe('useTopicDragging', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('isBeingDragged', () => {
    it('is `false` when topic is not being dragged', () => {
      const { result } = renderHook(() => useDraggableTopic(tSailing.id));

      expect(result.current.isBeingDragged).toBe(false);
    });

    it('is `true` when topic is being dragged', () => {
      const { result } = renderHook(() => useDraggableTopic(tSailing.id));

      act(() => {
        setDraggedTopics(core, [tSailing.id]);
      });

      expect(result.current.isBeingDragged).toBe(true);
    });
  });

  describe('onDragStart', () => {
    it('selects the topic if not selected', () => {
      const { getByTestId } = render(<Topic />);

      act(() => {
        fireEvent.dragStart(getByTestId('topic'), dragStartEvent);
      });

      expect(getSelectedTopics()[tSailing.id]).toBeDefined();
    });

    it('sets action and selected topics as topics in data transfer', () => {
      const { getByTestId } = render(<Topic />);
      const dataTransfer = {
        types: [],
        data: {},
        getData: (key) => dataTransfer.data[key],
      };
      const event = {
        dataTransfer: {
          setData: (key, value) => {
            dataTransfer.data[key] = value;
            dataTransfer.types.push(key);
          },
        },
      };

      act(() => {
        selectTopics(core, [tAnchoring.id]);
        fireEvent.dragStart(getByTestId('topic'), event);
      });

      const dataInsert = createDataInsertFromDataTransfer(
        dataTransfer as unknown as DataTransfer,
      );

      expect(dataInsert.action).toEqual('sort');
      expect(dataInsert.topics.includes(tSailing.id)).toBeTruthy();
      expect(dataInsert.topics.includes(tAnchoring.id)).toBeTruthy();
    });
  });
});
