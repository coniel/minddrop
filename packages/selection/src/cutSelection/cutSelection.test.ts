import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { setup, cleanup, selectedDrop1, selectedTopic1 } from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { cutSelection } from './cutSelection';

describe('cutSelection', () => {
  let data: Record<string, string> = {};
  const clipboardEvent = {
    preventDefault: vi.fn(),
    clipboardData: {
      clearData: vi.fn(),
      setData: (key: string, value: string) => {
        data[key] = value;
      },
    },
  } as unknown as React.ClipboardEvent;

  beforeEach(() => {
    setup();

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedDrop1, selectedTopic1]);
  });

  afterEach(() => {
    cleanup();

    data = {};
  });

  it('sets the clipboard data', () => {
    // Trigger a cut
    cutSelection(clipboardEvent);

    // Should set the clipboard data
    expect(data[`minddrop-selection/${selectedDrop1.type}`]).toEqual(
      JSON.stringify([selectedDrop1]),
    );
  });

  it('dispatches a `selection:clipboard:cut` event', () =>
    new Promise<void>((done) => {
      // Listen to 'selection:clipboard:cut' events
      Events.addListener('selection:clipboard:cut', 'test', (payload) => {
        // Payload data should contain the event
        expect(payload.data.event).toEqual(clipboardEvent);
        // Payload data should contain the selection
        expect(payload.data.selection).toEqual([selectedDrop1, selectedTopic1]);
        done();
      });

      // Trigger a cut
      cutSelection(clipboardEvent);
    }));
});
