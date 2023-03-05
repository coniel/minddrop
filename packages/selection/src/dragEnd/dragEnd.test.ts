import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import {
  setup,
  cleanup,
  core,
  selectedDrop1,
  selectedTopic1,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
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
      .addSelectedItems([selectedDrop1, selectedTopic1]);
  });

  afterEach(cleanup);

  it('sets `isDragging` to `false`', () => {
    // End a drag
    dragEnd(core, dragEvent);

    // Should set `isDragging` to `false`
    expect(useSelectionStore.getState().isDragging).toBe(false);
  });

  it('dispatches a `selection:drag:end: event', () =>
    new Promise<void>((done) => {
      // Listen to 'selection:drag:end' events
      core.addEventListener('selection:drag:end', (payload) => {
        // Payload data should contain the event
        expect(payload.data.event).toEqual(dragEvent);
        // Payload data should contain the selection
        expect(payload.data.selection).toEqual([selectedDrop1, selectedTopic1]);
        done();
      });

      // End a drag
      dragEnd(core, dragEvent);
    }));
});
