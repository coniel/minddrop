import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BlocksStore } from '../BlocksStore';
import { BlockNotFoundError } from '../errors';
import { getBlock } from '../getBlock';
import { blocks, cleanup, textBlock } from '../test-utils';
import { updateBlock } from './updateBlock';

describe('updateBlock', () => {
  beforeEach(() => {
    BlocksStore.getState().load(blocks);
  });

  afterEach(cleanup);

  it('throws if the block is not found', () => {
    expect(() => updateBlock('invalid-id', { text: 'New text' })).toThrow(
      BlockNotFoundError,
    );
  });

  it('updates a block in the store', () => {
    updateBlock(textBlock.id, { text: 'New text' });

    // Get the updated block
    const block = getBlock(textBlock.id);

    expect(block?.text).toBe('New text');
  });

  it('updates the last modified timestamp', () => {
    const block = updateBlock(textBlock.id, { text: 'New text' });

    expect(block.lastModified > textBlock.lastModified).toBeTruthy();
  });

  it('returns the updated block', () => {
    const block = updateBlock(textBlock.id, { text: 'New text' });

    expect(block.text).toBe('New text');
  });

  it('dispatches a block update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('blocks:block:update', 'test', (payload) => {
        // Payload data should be the block
        expect(payload.data).toEqual({
          ...textBlock,
          lastModified: expect.any(Date),
          text: 'New text',
        });
        done();
      });

      // Update the block
      updateBlock(textBlock.id, { text: 'New text' });
    }));
});
