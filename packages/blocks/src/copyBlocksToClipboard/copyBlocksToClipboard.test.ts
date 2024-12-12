/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { block1, block2 } from '../test-utils';
import { copyBlocksToClipboard } from './copyBlocksToClipboard';

describe('copySelection', () => {
  beforeEach(() => {
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

  it('sets the clipboard data', () => {
    const writeSpy = vi.spyOn(navigator.clipboard, 'write');

    // Trigger a copy
    copyBlocksToClipboard([block1, block2]);

    // Should set the clipboard data
    expect(writeSpy).toHaveBeenCalledTimes(1);
    expect(writeSpy).toHaveBeenCalledWith([expect.any(ClipboardItem)]);
  });
});
