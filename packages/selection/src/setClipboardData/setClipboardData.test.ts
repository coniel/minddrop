import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem3,
  selectionItemTypeConfig,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { setClipboardData } from './setClipboardData';
import { ACTION_DATA_KEY } from '../constants';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';

describe('setClipboardData', () => {
  let data: Record<string, string> = {};
  const clipboardEvent = {
    clipboardData: {
      setData: (key: string, value: string) => {
        data[key] = value;
      },
    },
  } as unknown as React.ClipboardEvent;

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

    data = {};
  });

  it('sets the action on the event', () => {
    // Set clipboard data with an action of 'move'
    setClipboardData(clipboardEvent, 'move');

    // Should set the action to 'move'
    expect(data[ACTION_DATA_KEY]).toBe('move');
  });

  it('serializes the selection to the event data transfer', () => {
    // Set clipboard data
    setClipboardData(clipboardEvent, 'move');

    // Should set the current selection items
    expect(data['application/json']).toBe(
      JSON.stringify([selectedItem1.getData!(), selectedItem3.getData!()]),
    );
  });
});
