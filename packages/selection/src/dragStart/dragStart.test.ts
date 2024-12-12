import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem3,
  selectionItemTypeConfig,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { ACTION_DATA_KEY } from '../constants';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';
import { SelectionDragEventData } from '../types';
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
      .addSelectedItems([selectedItem1, selectedItem3]);
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
      JSON.stringify([selectedItem1.getData!(), selectedItem3.getData!()]),
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
            selectedItem1,
            selectedItem3,
          ]);
          done();
        },
      );

      // Initiate a drag
      dragStart(dragEvent, 'move');
    }));
});
