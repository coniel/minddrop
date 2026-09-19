import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  createDataTransfer,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { toMimeType } from '@minddrop/utils';
import {
  DragSource,
  cancelDragWithEscape,
  cleanup,
  dragAndDrop,
  dragOver,
  setup,
} from '../test-utils';
import { DragMoveData, DropEventData, DroppableOptions } from '../types';
import { useDroppable } from './useDroppable';

/**
 * Renders a drop target reporting whether it is dragged over and
 * where the drop would land.
 */
const Droppable: React.FC<
  Partial<DroppableOptions> & { children?: React.ReactNode }
> = ({ children, id = 'target', ...options }) => {
  const { droppableProps, isDraggingOver, dropIndicatorPosition } =
    useDroppable({ type: 'test', id, ...options });

  return (
    <div
      data-testid={id}
      data-dragging-over={isDraggingOver}
      data-indicator={dropIndicatorPosition ?? ''}
      {...droppableProps}
    >
      {children}
    </div>
  );
};

/**
 * Renders a draggable item with data of the given types.
 */
const Draggable: React.FC<{ types?: string[] }> = ({ types = ['wanted'] }) => (
  <DragSource
    id="item-1"
    type="item"
    data={Object.fromEntries(types.map((type) => [type, ['item-1']]))}
    testId="item"
  />
);

/**
 * Creates a stand-in for the data transfer of a native drag from
 * outside the app.
 *
 * @param types - The data types the drag has.
 * @returns The data transfer.
 */
function nativeDragOf(...types: string[]): DataTransfer {
  return createDataTransfer(
    Object.fromEntries(
      types.map((type) => [toMimeType(type), JSON.stringify(['item-1'])]),
    ),
  );
}

describe('useDroppable', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reports being dragged over', () => {
    render(
      <>
        <Draggable />
        <Droppable />
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('target'));

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-dragging-over',
      'true',
    );
  });

  it('stops reporting it when the drag leaves', () => {
    render(
      <>
        <Draggable />
        <Droppable />
        <div data-testid="elsewhere" />
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('target'));

    document.elementFromPoint = () => screen.getByTestId('elsewhere');
    fireEvent.pointerMove(window, { clientX: 0, clientY: 0, buttons: 1 });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-dragging-over',
      'false',
    );
  });

  it('stops reporting it when the drag is cancelled', () => {
    render(
      <>
        <Draggable />
        <Droppable />
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('target'));
    cancelDragWithEscape();

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-dragging-over',
      'false',
    );
  });

  it('positions the indicator along the axis', () => {
    render(
      <>
        <Draggable />
        <Droppable axis="vertical" index={1} />
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('target'), {
      clientY: 10,
    });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-indicator',
      'before',
    );

    fireEvent.pointerMove(window, { clientX: 0, clientY: 90, buttons: 1 });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-indicator',
      'after',
    );
  });

  it('marks the ends of the list', () => {
    render(
      <>
        <Draggable />
        <Droppable axis="vertical" index={0} isLastChild />
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('target'), {
      clientY: 10,
    });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-indicator',
      'start',
    );

    fireEvent.pointerMove(window, { clientX: 0, clientY: 90, buttons: 1 });

    expect(screen.getByTestId('target')).toHaveAttribute(
      'data-indicator',
      'end',
    );
  });

  it('takes the drop with the drag data and where it landed', () => {
    const drops: DropEventData[] = [];

    render(
      <>
        <Draggable />
        <Droppable
          axis="vertical"
          index={2}
          onDrop={(drop) => drops.push(drop)}
        />
      </>,
    );

    dragAndDrop(screen.getByTestId('item'), screen.getByTestId('target'), {
      clientX: 5,
      clientY: 90,
    });

    expect(drops).toEqual([
      {
        targetType: 'test',
        targetId: 'target',
        index: 2,
        position: 'after',
        data: { wanted: ['item-1'] },
        origin: null,
        clientX: 5,
        clientY: 90,
      },
    ]);
  });

  it('reports the drag moving over it', () => {
    const moves: DragMoveData[] = [];

    render(
      <>
        <Draggable />
        <Droppable onDragMove={(move) => moves.push(move)} />
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('target'), {
      clientX: 5,
      clientY: 6,
    });

    expect(moves.at(-1)).toEqual({
      clientX: 5,
      clientY: 6,
      target: screen.getByTestId('target'),
      position: 'inside',
    });
  });

  describe('accepted types', () => {
    it('ignores a drag with none of them', () => {
      render(
        <>
          <Draggable types={['other']} />
          <Droppable accepts={['wanted']} />
        </>,
      );

      dragOver(screen.getByTestId('item'), screen.getByTestId('target'));

      expect(screen.getByTestId('target')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('lets a drag it ignores through to the targets around it', () => {
      render(
        <>
          <Draggable types={['other']} />
          <Droppable id="outer">
            <Droppable id="inner" accepts={['wanted']} />
          </Droppable>
        </>,
      );

      dragOver(screen.getByTestId('item'), screen.getByTestId('inner'));

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'true',
      );
    });

    it('keeps an accepted drag from the targets around it', () => {
      render(
        <>
          <Draggable />
          <Droppable id="outer">
            <Droppable id="inner" accepts={['wanted']} />
          </Droppable>
        </>,
      );

      dragOver(screen.getByTestId('item'), screen.getByTestId('inner'));

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('lets an accepted drag reach the targets around it when not claiming it', () => {
      render(
        <>
          <Draggable />
          <Droppable id="outer">
            <Droppable id="inner" accepts={['wanted']} claim={false} />
          </Droppable>
        </>,
      );

      dragOver(screen.getByTestId('item'), screen.getByTestId('inner'));

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'true',
      );
    });
  });

  it('drops on the innermost target', () => {
    const drops: string[] = [];

    render(
      <>
        <Draggable />
        <Droppable id="outer" onDrop={() => drops.push('outer')}>
          <Droppable id="inner" onDrop={() => drops.push('inner')} />
        </Droppable>
      </>,
    );

    dragAndDrop(screen.getByTestId('item'), screen.getByTestId('inner'));

    expect(drops).toEqual(['inner']);
  });

  it('only reacts to drags directly over it when direct only', () => {
    render(
      <>
        <Draggable />
        <Droppable id="outer" directOnly>
          <div data-testid="child" />
        </Droppable>
      </>,
    );

    dragOver(screen.getByTestId('item'), screen.getByTestId('child'));

    expect(screen.getByTestId('outer')).toHaveAttribute(
      'data-dragging-over',
      'false',
    );

    document.elementFromPoint = () => screen.getByTestId('outer');
    fireEvent.pointerMove(window, { clientX: 0, clientY: 0, buttons: 1 });

    expect(screen.getByTestId('outer')).toHaveAttribute(
      'data-dragging-over',
      'true',
    );
  });

  describe('native drags from outside the app', () => {
    it('reports being dragged over', () => {
      render(<Droppable />);

      fireEvent.dragOver(screen.getByTestId('target'), {
        dataTransfer: nativeDragOf('wanted'),
      });

      expect(screen.getByTestId('target')).toHaveAttribute(
        'data-dragging-over',
        'true',
      );
    });

    it('stops reporting it when the drag leaves', () => {
      render(<Droppable />);

      fireEvent.dragOver(screen.getByTestId('target'), {
        dataTransfer: nativeDragOf('wanted'),
      });
      fireEvent.dragLeave(screen.getByTestId('target'), {
        dataTransfer: nativeDragOf('wanted'),
      });

      expect(screen.getByTestId('target')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('ignores a drag with none of the accepted types', () => {
      render(<Droppable accepts={['wanted']} />);

      fireEvent.dragOver(screen.getByTestId('target'), {
        dataTransfer: nativeDragOf('other'),
      });

      expect(screen.getByTestId('target')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('keeps an accepted drag from the targets around it', () => {
      render(
        <Droppable id="outer">
          <Droppable id="inner" accepts={['wanted']} />
        </Droppable>,
      );

      fireEvent.dragOver(screen.getByTestId('inner'), {
        dataTransfer: nativeDragOf('wanted'),
      });

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });

    it('takes the drop with the transferred data', () => {
      const drops: DropEventData[] = [];

      render(<Droppable onDrop={(drop) => drops.push(drop)} />);

      fireEvent.drop(screen.getByTestId('target'), {
        dataTransfer: nativeDragOf('wanted'),
      });

      expect(drops[0]?.data).toEqual({ wanted: ['item-1'] });
      expect(drops[0]?.origin).toBeNull();
    });

    it('stops reporting it when a nested drop target takes the drop', () => {
      render(
        <Droppable id="outer">
          <Droppable id="inner" claim={false} />
        </Droppable>,
      );

      fireEvent.dragOver(screen.getByTestId('inner'), {
        dataTransfer: nativeDragOf('wanted'),
      });

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'true',
      );

      fireEvent.drop(screen.getByTestId('inner'), {
        dataTransfer: nativeDragOf('wanted'),
      });

      expect(screen.getByTestId('outer')).toHaveAttribute(
        'data-dragging-over',
        'false',
      );
    });
  });

  it('unregisters when unmounted', () => {
    const drops: string[] = [];
    const { unmount } = render(
      <>
        <Draggable />
        <Droppable onDrop={() => drops.push('target')} />
      </>,
    );
    const target = screen.getByTestId('target');

    unmount();
    render(<Draggable />);

    // Drop on the unmounted element
    dragAndDrop(screen.getByTestId('item'), target);

    expect(drops).toEqual([]);
  });
});
