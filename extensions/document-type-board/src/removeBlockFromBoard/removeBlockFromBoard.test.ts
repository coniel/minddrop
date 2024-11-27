import { describe, afterEach, it, expect, vi } from 'vitest';
import { MindDropApi } from '@minddrop/extension';
import { boardDocument, textBlock1, textBlock2 } from '../test-utils';
import { removeBlockFromBoard } from './removeBlockFromBoard';

const updateDocument = vi.fn();

const api = { Documents: { update: updateDocument } } as unknown as MindDropApi;

describe('removeBlockFromBoard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('removes the block from the board', async () => {
    vi.useFakeTimers();

    // Remove textBlock1 from the board
    removeBlockFromBoard(api, boardDocument, textBlock1);

    // Advance timers to trigger the debounce
    vi.advanceTimersByTime(30);

    // Should update the document
    expect(updateDocument).toHaveBeenCalledTimes(1);

    // Shoud remove textBlock1 from the board
    expect(updateDocument.mock.calls[0][1].content.blocks).not.toContain(
      textBlock1,
    );
  });

  it('batches multiple calls into a single operation', async () => {
    vi.useFakeTimers();

    // Remove textBlock1 from the board
    removeBlockFromBoard(api, boardDocument, textBlock1);
    // Remove textBlock2 from the board
    removeBlockFromBoard(api, boardDocument, textBlock2);

    // Advance timers to trigger the debounce
    vi.advanceTimersByTime(30);

    // Ensure that only one update event was fired
    expect(updateDocument).toHaveBeenCalledTimes(1);

    // Board should no longer contain textBlock1 or textBlock2
    expect(updateDocument.mock.calls[0][1].content.blocks).not.toContain(
      textBlock1,
    );
    expect(updateDocument.mock.calls[0][1].content.blocks).not.toContain(
      textBlock2,
    );
  });
});
