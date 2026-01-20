import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';
import { ACTION_DATA_KEY } from '../constants';
import {
  cleanup,
  selectionItem1,
  selectionItem3,
  selectionItemTypeConfig,
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

    // Register a serializer
    registerSelectionItemType(selectionItemTypeConfig);

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectionItem1, selectionItem3]);
  });

  afterEach(() => {
    cleanup();

    // Reset the drag event data
    data = {};
  });

  it('sets the action on the event', () => {
    // Initiate a drag with an action of 'move'
    dragStart(dragEvent, 'move');

    // Should set the 'minddrop/action' data to 'move'
    expect(data[ACTION_DATA_KEY]).toBe('move');
  });

  it('sets the selection data', () => {
    // Initiate a drag
    dragStart(dragEvent, 'move');

    // Should set the selection data
    expect(data['application/json']).toEqual(
      JSON.stringify([selectionItem1.getData!(), selectionItem3.getData!()]),
    );
  });

  it('sets `isDragging` to `true`', () => {
    // Initiate a drag
    dragStart(dragEvent, 'move');

    // Should set `isDragging` to `true`
    expect(useSelectionStore.getState().isDragging).toBe(true);
  });

  it('dispatches a `selection:drag:start: event', () =>
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
      dragStart(dragEvent, 'move');
    }));
});
