import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BlocksStore } from '../BlocksStore';
import { BlockNotFoundError } from '../errors';
import { getBlock } from '../getBlock';
import { block1, blocks, cleanup } from '../test-utils';
import { deleteBlock } from './deleteBlock';

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
