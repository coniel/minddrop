import { afterEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BlocksStore } from '../BlocksStore';
import { blocks, blocksObject, cleanup } from '../test-utils';
import { loadBlocks } from './loadBlocks';

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
