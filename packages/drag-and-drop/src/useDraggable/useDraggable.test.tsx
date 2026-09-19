import React from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { DragStore } from '../DragStore';
import {
  cleanup,
  dragAndDrop,
  dragOver,
  releaseDrag,
  setup,
} from '../test-utils';
import { UseDraggableOptions, useDraggable } from './useDraggable';

type Options = Partial<UseDraggableOptions<Record<string, unknown>>>;

/**
 * Renders a draggable item reporting whether it is being dragged.
 */
const Draggable: React.FC<
  Options & { testId?: string; children?: React.ReactNode }
> = ({ testId = 'item', children, ...options }) => {
  const { draggableProps, isDragging } = useDraggable({
    id: 'item-1',
    type: 'item',
    data: { items: ['item-1'] },
    ...options,
  });

  return (
    <div data-testid={testId} data-dragging={isDragging} {...draggableProps}>
      {children}
    </div>
  );
};

describe('useDraggable', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("starts a drag with the item's data once the press moves", () => {
    render(<Draggable />);

    dragOver(screen.getByTestId('item'), document.body);

    expect(DragStore.getState().active).toEqual(
      expect.objectContaining({ data: { items: ['item-1'] } }),
    );
    expect(screen.getByTestId('item')).toHaveAttribute('data-dragging', 'true');
  });

  it('resolves the data as the drag starts', () => {
    let items = ['stale'];

    render(<Draggable data={() => ({ items })} />);

    items = ['fresh'];

    dragOver(screen.getByTestId('item'), document.body);

    expect(DragStore.getState().active).toEqual(
      expect.objectContaining({ data: { items: ['fresh'] } }),
    );
  });

  it('has the drag effect', () => {
    render(<Draggable effect="copy" />);

    dragOver(screen.getByTestId('item'), document.body);

    expect(DragStore.getState().active).toEqual(
      expect.objectContaining({ effect: 'copy' }),
    );
  });

  it('does not start a drag from a press which stays put', () => {
    render(<Draggable />);

    fireEvent.pointerDown(screen.getByTestId('item'), {
      button: 0,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerMove(window, { clientX: 12, clientY: 12, buttons: 1 });

    expect(DragStore.getState().active).toBeNull();
  });

  it('does not start a drag from a secondary button', () => {
    render(<Draggable />);

    fireEvent.pointerDown(screen.getByTestId('item'), { button: 2 });
    fireEvent.pointerMove(window, { clientX: 50, clientY: 50, buttons: 2 });

    expect(DragStore.getState().active).toBeNull();
  });

  it('does not start a drag when disabled', () => {
    render(<Draggable disabled />);

    dragOver(screen.getByTestId('item'), document.body);

    expect(DragStore.getState().active).toBeNull();
  });

  it('does not start a drag from a press on a text field inside it', () => {
    render(
      <Draggable>
        <input data-testid="field" />
      </Draggable>,
    );

    dragOver(screen.getByTestId('field'), document.body);

    expect(DragStore.getState().active).toBeNull();
  });

  it('does not start a drag from a press inside an opted out element', () => {
    render(
      <Draggable>
        <div data-no-drag>
          <span data-testid="content">content</span>
        </div>
      </Draggable>,
    );

    dragOver(screen.getByTestId('content'), document.body);

    expect(DragStore.getState().active).toBeNull();
  });

  it('leaves a press on a nested draggable to it', () => {
    const activated: string[] = [];

    render(
      <Draggable testId="outer" onActivate={() => activated.push('outer')}>
        <Draggable
          testId="inner"
          id="item-2"
          onActivate={() => activated.push('inner')}
        />
      </Draggable>,
    );

    dragOver(screen.getByTestId('inner'), document.body);

    expect(DragStore.getState().active).toEqual(
      expect.objectContaining({ id: 'item-2' }),
    );
    expect(activated).toEqual(['inner']);
  });

  it('notifies the item as the drag starts', () => {
    const presses: boolean[] = [];

    render(<Draggable onActivate={(press) => presses.push(press.shiftKey)} />);

    dragOver(screen.getByTestId('item'), document.body, { shiftKey: true });

    expect(presses).toEqual([true]);
  });

  it('stops reporting being dragged once the drag ends', () => {
    render(<Draggable />);

    dragAndDrop(screen.getByTestId('item'), document.body);

    expect(screen.getByTestId('item')).toHaveAttribute(
      'data-dragging',
      'false',
    );
  });

  it('swallows the click the release fires', () => {
    let clicks = 0;

    render(
      <Draggable>
        <button data-testid="button" onClick={() => (clicks += 1)}>
          Act
        </button>
      </Draggable>,
    );

    dragOver(screen.getByTestId('button'), screen.getByTestId('button'));
    releaseDrag();

    expect(clicks).toBe(0);
  });

  it('prevents the press from anchoring a text selection', () => {
    render(
      <Draggable>
        <button data-testid="button">Act</button>
      </Draggable>,
    );

    // Press the button. A selection anchored by the press would extend
    // into any editable text the drag crosses.
    const anchored = fireEvent.mouseDown(screen.getByTestId('button'), {
      button: 0,
    });

    expect(anchored).toBe(false);
  });

  it('leaves the press on a text field to the field', () => {
    render(
      <Draggable>
        <input data-testid="field" />
      </Draggable>,
    );

    const kept = fireEvent.mouseDown(screen.getByTestId('field'), {
      button: 0,
    });

    expect(kept).toBe(true);
  });

  it('prevents the browser from dragging the element natively', () => {
    render(<Draggable />);

    const prevented = !fireEvent.dragStart(screen.getByTestId('item'));

    expect(screen.getByTestId('item')).toHaveAttribute('draggable', 'false');
    expect(prevented).toBe(true);
  });
});
