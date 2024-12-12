import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem3,
  selectionItemTypeConfig,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';
import { SelectionClipboardEventData } from '../types';
import { cutSelection } from './cutSelection';

const onDelete = vi.fn();

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

    // Register a serializer
    registerSelectionItemType({ ...selectionItemTypeConfig, onDelete });

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem3]);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();

    data = {};
  });

  it('sets the clipboard data', () => {
    // Trigger a cut
    cutSelection(clipboardEvent);

    // Should set the clipboard data
    expect(data['application/json']).toEqual(
      JSON.stringify([selectedItem1.getData!(), selectedItem3.getData!()]),
    );
  });

  it('deletes the selection items', () => {
    // Trigger a cut
    cutSelection(clipboardEvent);

    // Should delete the selection
    expect(onDelete).toHaveBeenCalled();
  });

  it('dispatches a selection cut event', () =>
    new Promise<void>((done) => {
      // Listen to 'selection:clipboard:cut' events
      Events.addListener<SelectionClipboardEventData>(
        'selection:cut',
        'test',
        (payload) => {
          // Payload data should contain the event
          expect(payload.data.event).toEqual(clipboardEvent);
          // Payload data should contain the selection
          expect(payload.data.selection).toEqual([
            selectedItem1,
            selectedItem3,
          ]);
          done();
        },
      );

      // Trigger a cut
      cutSelection(clipboardEvent);
    }));
});
