import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import { setup, cleanup, selectedDrop1, selectedTopic1 } from '../test-utils';
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

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedTopic1]);
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
    expect(data['minddrop/action']).toBe('move');
  });

  it('sets the selection data', () => {
    // Initiate a drag
    dragStart(dragEvent, 'move');

    // Should set the current selection items grouped
    // by resource.
    expect(data[`minddrop-selection/${selectedDrop1.type}`]).toEqual(
      JSON.stringify([selectedDrop1]),
    );
    expect(data[`minddrop-selection/${selectedTopic1.type}`]).toEqual(
      JSON.stringify([selectedTopic1]),
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
      Events.addListener('selection:drag:start', 'test', (payload) => {
        // Payload data should contain the event
        expect(payload.data.event).toEqual(dragEvent);
        // Payload data should contain the selection
        expect(payload.data.selection).toEqual([selectedDrop1, selectedTopic1]);
        done();
      });

      // Initiate a drag
      dragStart(dragEvent, 'move');
    }));
});
