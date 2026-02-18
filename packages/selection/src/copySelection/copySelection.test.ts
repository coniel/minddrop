import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { SelectionCopiedEvent, SelectionCopiedEventData } from '../events';
import { cleanup, selection, serialzedSelection, setup } from '../test-utils';
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
    setup({ loadSelection: true });

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).ClipboardItem = ClipboardItemMock;
  });

  afterEach(() => {
    cleanup();

    data = {};
  });

  it('serializes the selection items to the clipboard event data transfer', () => {
    // Trigger a copy
    copySelection(clipboardEvent);

    // Should set the clipboard data
    expect(data).toEqual(serialzedSelection);
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
      Events.addListener<SelectionCopiedEventData>(
        SelectionCopiedEvent,
        'test',
        (payload) => {
          // Payload data should contain the event
          expect(payload.data.event).toEqual(clipboardEvent);
          // Payload data should contain the selection
          expect(payload.data.selection).toEqual(selection);
          done();
        },
      );

      // Trigger a copy
      copySelection(clipboardEvent);
    }));
});
