import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  cleanup,
  mimeType1,
  selectionItem1,
  selectionItem3,
  setup,
} from '../test-utils';
import { SelectionDragEventData } from '../types';
import { useSelectionStore } from '../useSelectionStore';
import { dragStart } from './dragStart';

describe('dragStart', () => {
  let data: Record<string, string> = {};
  const dragEvent = {
    dataTransfer: {
      setData: (key: string, value: string) => {
        data[key] = value;
      },
    },
  } as unknown as React.DragEvent;

  beforeEach(() => {
    setup();

    // Select an item
    useSelectionStore.getState().addSelectedItems([selectionItem1]);
  });

  afterEach(() => {
    cleanup();

    // Reset the drag event data
    data = {};
  });

  it('sets the selection data', () => {
    // Initiate a drag
    dragStart(dragEvent);

    // Should set the selection data
    expect(data[mimeType1]).toEqual(JSON.stringify([selectionItem1.data]));
  });

  it('sets `isDragging` to `true`', () => {
    // Initiate a drag
    dragStart(dragEvent);

    // Should set `isDragging` to `true`
    expect(useSelectionStore.getState().isDragging).toBe(true);
  });

  it.skip('dispatches a `selection:drag:start: event', () =>
    new Promise<void>((done) => {
      // Listen to 'selection:drag:start' events
      Events.addListener<SelectionDragEventData>(
        'selection:drag:start',
        'test',
        (payload) => {
          // Payload data should contain the event
          expect(payload.data.event).toEqual(dragEvent);
          // Payload data should contain the selection
          expect(payload.data.selection).toEqual([
            selectionItem1,
            selectionItem3,
          ]);
          done();
        },
      );

      // Initiate a drag
      dragStart(dragEvent);
    }));
});
