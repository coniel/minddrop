import { describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import { BLOCKS_DATA_KEY } from '../constants';
import { block1, block2 } from '../test-utils';
import { getBlocksFromDataTransfer } from './getBlocksFromDataTransfer';

describe('getBlocksFromDataTransfer', () => {
  it('returns an empty array if the data transfer does not contain blocks', () => {
    const dataTransfer = createDataTransfer({});

    expect(getBlocksFromDataTransfer(dataTransfer)).toEqual([]);
  });

  it('returns the blocks from the data transfer', () => {
    const dataTransfer = createDataTransfer({
      [BLOCKS_DATA_KEY]: JSON.stringify([block1, block2]),
    });

    expect(getBlocksFromDataTransfer(dataTransfer)).toEqual([block1, block2]);
  });
});
