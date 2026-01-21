import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';
import {
  cleanup,
  selectionItem1,
  selectionItem3,
  selectionItemTypeConfig,
  setup,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { setClipboardData } from './setClipboardData';

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
      .addSelectedItems([selectionItem1, selectionItem3]);
  });

  afterEach(() => {
    cleanup();

    data = {};
  });

  it('sets the action on the event', () => {
    // Set clipboard data with an action of 'move'
    setClipboardData(clipboardEvent, 'move');
  });

  it('serializes the selection to the event data transfer', () => {
    // Set clipboard data
    setClipboardData(clipboardEvent, 'move');

    // Should set the current selection items
    expect(data['application/json']).toBe(
      JSON.stringify([selectionItem1.getData!(), selectionItem3.getData!()]),
    );
  });
});
