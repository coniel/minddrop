import { describe, afterEach, it, expect } from 'vitest';
import { Events } from '@minddrop/events';
import { cleanup, blocks, blocksObject } from '../test-utils';
import { loadBlocks } from './loadBlocks';
import { BlocksStore } from '../BlocksStore';

describe('loadBlocks', () => {
  afterEach(cleanup);

  it('loads blocks into the store', () => {
    loadBlocks(blocks);

    expect(BlocksStore.getState().blocks).toEqual(blocksObject);
  });

  it('dispatches a blocks load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('blocks:load', 'test', (payload) => {
        // Payload data should be the loaded blocks
        expect(payload.data).toEqual(blocks);
        done();
      });

      // Load the blocks
      loadBlocks(blocks);
    }));
});
