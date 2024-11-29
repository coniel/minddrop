import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup, blocks, block1 } from '../test-utils';
import { deleteBlock } from './deleteBlock';
import { BlocksStore } from '../BlocksStore';
import { getBlock } from '../getBlock';
import { BlockNotFoundError } from '../errors';

describe('deleteBlock', () => {
  beforeEach(() => {
    BlocksStore.getState().load(blocks);
  });

  afterEach(cleanup);

  it('throws if the block does not exist', () => {
    expect(() => deleteBlock('non-existent')).toThrow(BlockNotFoundError);
  });

  it('removes the block from the store', () => {
    deleteBlock(block1.id);

    expect(getBlock(block1.id)).toBeNull();
  });

  it('dispatches a block delete event', async () =>
    new Promise<void>((done) => {
      Events.addListener('blocks:block:delete', 'test', (payload) => {
        // Payload data should be the block
        expect(payload.data).toEqual(block1);
        done();
      });

      // Delete a block
      deleteBlock(block1.id);
    }));
});
