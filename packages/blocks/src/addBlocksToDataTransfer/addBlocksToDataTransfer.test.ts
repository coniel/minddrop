import { describe, afterEach, it, expect } from 'vitest';
import { addBlocksToDataTransfer } from './addBlocksToDataTransfer';
import { createDataTransfer } from '@minddrop/test-utils';
import { block1, block2 } from '../test-utils';

describe('addBlocksToDataTransfer', () => {
  let dataTransfer = createDataTransfer({});

  afterEach(() => {
    dataTransfer = createDataTransfer({});
  });

  it('adds blocks to the data dataTransfer', () => {
    addBlocksToDataTransfer(dataTransfer, [block1, block2]);

    expect(dataTransfer.getData('application/minddrop-blocks')).toEqual(
      JSON.stringify([block1, block2]),
    );
  });

  it('preserves existing blocks in the data dataTransfer', () => {
    dataTransfer.setData(
      'application/minddrop-blocks',
      JSON.stringify([block1]),
    );

    addBlocksToDataTransfer(dataTransfer, [block2]);

    expect(dataTransfer.getData('application/minddrop-blocks')).toEqual(
      JSON.stringify([block1, block2]),
    );
  });
});