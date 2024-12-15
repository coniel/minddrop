import { describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import { BLOCKS_DATA_KEY } from '../constants';
import { block1, block2 } from '../test-utils';
import { removeBlocksFromDataTransfer } from './removeBlocksFromDataTransfer';

describe('removeBlocksFromDataTransfer', () => {
  it('does nothing if the data transfer does not contain blocks', () => {
    const dataTransfer = createDataTransfer({});

    removeBlocksFromDataTransfer(dataTransfer, [block1.id]);

    expect(dataTransfer.getData(BLOCKS_DATA_KEY)).toBeUndefined();
  });

  it('removes the blocks from the data transfer', () => {
    const dataTransfer = createDataTransfer({
      [BLOCKS_DATA_KEY]: JSON.stringify([block1, block2]),
    });

    removeBlocksFromDataTransfer(dataTransfer, [block1.id]);

    expect(dataTransfer.getData(BLOCKS_DATA_KEY)).toBe(
      JSON.stringify([block2]),
    );
  });

  it('removes blocks data type from the data transfer if no blocks are left', () => {
    const dataTransfer = createDataTransfer({
      [BLOCKS_DATA_KEY]: JSON.stringify([block1]),
    });

    removeBlocksFromDataTransfer(dataTransfer, [block1.id]);

    expect(dataTransfer.getData(BLOCKS_DATA_KEY)).toBeUndefined();
  });
});
