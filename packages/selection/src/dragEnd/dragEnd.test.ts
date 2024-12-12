import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { setup, cleanup, selectedItem1, selectedItem3 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { SelectionDragEventData } from '../types';
import { dragEnd } from './dragEnd';

describe('dragEnd', () => {
  const dragEvent = {
    dataTransfer: {
      setData: vi.fn(),
    },
  } as unknown as React.DragEvent;

  beforeEach(() => {
    setup();

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem3]);
  });

  afterEach(cleanup);

  it('sets `isDragging` to `false`', () => {
    // End a drag
    dragEnd(dragEvent);

    // Should set `isDragging` to `false`
    expect(useSelectionStore.getState().isDragging).toBe(false);
  });

  it('dispatches a `selection:drag:end: event', () =>
    new Promise<void>((done) => {
      // Listen to 'selection:drag:end' events
      Events.addListener<SelectionDragEventData>(
        'selection:drag:end',
        'test',
        (payload) => {
          // Payload data should contain the event
          expect(payload.data.event).toEqual(dragEvent);
          // Payload data should contain the selection
          expect(payload.data.selection).toEqual([
            selectedItem1,
            selectedItem3,
          ]);
          done();
        },
      );

      // End a drag
      dragEnd(dragEvent);
    }));
});
