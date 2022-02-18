import React from 'react';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { act, fireEvent, render, renderHook } from '@minddrop/test-utils';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedDrops } from '../getSelectedDrops';
import { useDraggableDrop } from './useDraggableDrop';
import { createDataInsertFromDataTransfer } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setDraggedDrops } from '../setDraggedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

const dragStartEvent = {
  dataTransfer: {
    setData: jest.fn(),
  },
};

const Drop = () => {
  const { onDragStart } = useDraggableDrop(textDrop1.id);

  return <div onDragStart={onDragStart} data-testid="drop" />;
};

describe('useDropDragging', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('isBeingDragged', () => {
    it('is `false` when drop is not being dragged', () => {
      const { result } = renderHook(() => useDraggableDrop(textDrop1.id));

      expect(result.current.isBeingDragged).toBe(false);
    });

    it('is `true` when drop is being dragged', () => {
      const { result } = renderHook(() => useDraggableDrop(textDrop1.id));

      act(() => {
        setDraggedDrops(core, [textDrop1.id]);
      });

      expect(result.current.isBeingDragged).toBe(true);
    });
  });

  describe('onDragStart', () => {
    it('selects the drop if not selected', () => {
      const { getByTestId } = render(<Drop />);

      act(() => {
        fireEvent.dragStart(getByTestId('drop'), dragStartEvent);
      });

      expect(getSelectedDrops()[textDrop1.id]).toBeDefined();
    });

    it('sets action and selected drops as drops in data transfer', () => {
      const { getByTestId } = render(<Drop />);
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
        selectDrops(core, [textDrop2.id]);
        fireEvent.dragStart(getByTestId('drop'), event);
      });

      const dataInsert = createDataInsertFromDataTransfer(
        dataTransfer as unknown as DataTransfer,
      );

      expect(dataInsert.action).toEqual('sort');
      expect(dataInsert.drops.includes(textDrop1.id)).toBeTruthy();
      expect(dataInsert.drops.includes(textDrop2.id)).toBeTruthy();
    });
  });
});
