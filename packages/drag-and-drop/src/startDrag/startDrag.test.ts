import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { createDomRect, fireEvent } from '@minddrop/test-utils';
import { DragStore } from '../DragStore';
import { DragEndedEvent, DragStartedEvent } from '../events';
import { cleanup, releaseDrag, setup } from '../test-utils';
import { startDrag } from './startDrag';

const sourceRect = createDomRect(0, 0, 100, 40);

describe('startDrag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function start() {
    return startDrag({
      id: 'item-1',
      type: 'item',
      data: { items: ['item-1'], 'text/plain': 'Item 1' },
      origin: { type: 'list', id: 'list-1' },
      sourceElement: document.body,
      sourceRect,
      previewElement: document.body,
      clientX: 10,
      clientY: 10,
    });
  }

  it('sets the drag as active', () => {
    const drag = start();

    expect(DragStore.getState().active).toEqual(drag);
    expect(drag).toEqual(
      expect.objectContaining({
        types: ['items', 'text/plain'],
        origin: { type: 'list', id: 'list-1' },
      }),
    );
  });

  it('moves the item by default', () => {
    expect(start()).toEqual(expect.objectContaining({ effect: 'move' }));
  });

  it('marks the document as dragging', () => {
    start();

    expect(document.documentElement).toHaveAttribute('data-dragging');
  });

  it('dispatches a drag started event', () =>
    new Promise<void>((done) => {
      Events.addListener(DragStartedEvent, 'test', (payload) => {
        expect(payload.id).toBe('item-1');
        done();
      });

      start();
    }));

  it('rejects a second drag while one is in progress', () => {
    const first = start();

    expect(start()).toBeNull();
    expect(DragStore.getState().active).toEqual(first);
  });

  it('ends the drag when the pointer is released', () => {
    start();

    releaseDrag({ clientX: 10, clientY: 10 });

    expect(DragStore.getState().active).toBeNull();
    expect(document.documentElement).not.toHaveAttribute('data-dragging');
  });

  it('ends the drag on a move with no button held', () => {
    start();

    fireEvent.pointerMove(window, { clientX: 10, clientY: 10, buttons: 0 });

    expect(DragStore.getState().active).toBeNull();
  });

  it('cancels the drag on Escape', () =>
    new Promise<void>((done) => {
      Events.addListener(DragEndedEvent, 'test', (payload) => {
        expect(payload.dropped).toBe(false);
        done();
      });

      start();

      fireEvent.keyDown(window, { key: 'Escape' });
    }));

  it('cancels the drag when the window loses focus', () => {
    start();

    fireEvent.blur(window);

    expect(DragStore.getState().active).toBeNull();
  });

  it('cancels the drag when a native drag takes over', () => {
    start();

    fireEvent.dragStart(document.body);

    expect(DragStore.getState().active).toBeNull();
  });
});
