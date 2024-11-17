import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup, selectedItem1, selectedItem3 } from '../../test-utils';
import { useSelectionStore } from '../../useSelectionStore';
import { setClipboardData } from './setClipboardData';
import { ACTION_DATA_KEY, SELECTION_DATA_KEY } from '../../constants';

describe('setClipboardData', () => {
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
      .addSelectedItems([selectedItem1, selectedItem3]);
  });

  afterEach(() => {
    cleanup();

    // Clear the data
    data = {};
    // Clear mocks
    vi.clearAllMocks();
  });

  it('clears the default clipboard data', () => {
    // Set clipboard data
    setClipboardData(clipboardEvent, 'move');

    // Should clear the default clipboard data
    expect(clipboardEvent.clipboardData.clearData).toHaveBeenCalled();
  });

  it('sets the action on the event', () => {
    // Set clipboard data with an action of 'move'
    setClipboardData(clipboardEvent, 'move');

    // Should set the 'minddrop/action' data to 'move'
    expect(data[ACTION_DATA_KEY]).toBe('move');
  });

  it('sets the selection data', () => {
    // Set clipboard data
    setClipboardData(clipboardEvent, 'move');

    // Should set the selection data
    expect(data[SELECTION_DATA_KEY]).toBe(
      JSON.stringify([selectedItem1.getData(), selectedItem3.getData()]),
    );
  });
});
