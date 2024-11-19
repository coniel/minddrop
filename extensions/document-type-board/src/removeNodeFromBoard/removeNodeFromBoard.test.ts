import { describe, afterEach, it, expect, vi } from 'vitest';
import { MindDropApi } from '@minddrop/extension';
import { boardDocument, textNode1, textNode2 } from '../test-utils';
import { removeNodeFromBoard } from './removeNodeFromBoard';

const updateDocument = vi.fn();

const api = { Documents: { update: updateDocument } } as unknown as MindDropApi;

describe('removeNodeFromBoard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('removes the node from the board', async () => {
    vi.useFakeTimers();

    // Remove textNode1 from the board
    removeNodeFromBoard(api, boardDocument, textNode1);

    // Advance timers to trigger the debounce
    vi.advanceTimersByTime(30);

    // Should update the document
    expect(updateDocument).toHaveBeenCalledTimes(1);

    // Shoud remove textNode1 from the board
    expect(updateDocument.mock.calls[0][1].content.nodes).not.toContain(
      textNode1,
    );
  });

  it('batches multiple calls into a single operation', async () => {
    vi.useFakeTimers();

    // Remove textNode1 from the board
    removeNodeFromBoard(api, boardDocument, textNode1);
    // Remove textNode2 from the board
    removeNodeFromBoard(api, boardDocument, textNode2);

    // Advance timers to trigger the debounce
    vi.advanceTimersByTime(30);

    // Ensure that only one update event was fired
    expect(updateDocument).toHaveBeenCalledTimes(1);

    // Board should no longer contain textNode1 or textNode2
    expect(updateDocument.mock.calls[0][1].content.nodes).not.toContain(
      textNode1,
    );
    expect(updateDocument.mock.calls[0][1].content.nodes).not.toContain(
      textNode2,
    );
  });
});
