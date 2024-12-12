/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem3,
  selectionItemTypeConfig,
} from '../test-utils';
import { SelectionClipboardEventData } from '../types';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';
import { useSelectionStore } from '../useSelectionStore';
import { copySelection } from './copySelection';

describe('copySelection', () => {
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
    registerSelectionItemType(selectionItemTypeConfig);

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem3]);

    // Mock navigator.clipboard and its methods
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        write: vi.fn(),
      },
      writable: true,
    });

    class ClipboardItemMock {
      constructor(items: Record<string, Blob>) {
        this.items = items;
      }
      items: Record<string, Blob>;
    }

    // Assign mock ClipboardItem globally
    (global as any).ClipboardItem = ClipboardItemMock;
  });

  afterEach(() => {
    cleanup();

    data = {};
  });

  it('sets the clipboard data on an existing data transfer', () => {
    // Trigger a copy
    copySelection(clipboardEvent);

    // Should set the clipboard data
    expect(data['application/json']).toEqual(
      JSON.stringify([selectedItem1.getData!(), selectedItem3.getData!()]),
    );
  });

  it('creates clipboard data if there is no existing data transfer', () => {
    const writeSpy = vi.spyOn(navigator.clipboard, 'write');

    // Trigger a copy
    copySelection();

    // Should set the clipboard data
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledWith([expect.any(ClipboardItem)]);
  });

  it('dispatches a selection copy event', () =>
    new Promise<void>((done) => {
      Events.addListener<SelectionClipboardEventData>(
        'selection:copy',
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

      // Trigger a copy
      copySelection(clipboardEvent);
    }));
});
