import { describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import { BLOCK_TEMPLATES_DATA_KEY } from '../constants';
import { blockTemplate1, blockTemplate2 } from '../test-utils';
import { getBlockTemplatesFromDataTransfer } from './getBlockTemplatesFromDataTransfer';

describe('getBlockTemplatesFromDataTransfer', () => {
  it('returns an empty array if the data transfer does not contain block templates', () => {
    const dataTransfer = createDataTransfer({});

    expect(getBlockTemplatesFromDataTransfer(dataTransfer)).toEqual([]);
  });

  it('returns the block templates from the data transfer', () => {
    const dataTransfer = createDataTransfer({
      [BLOCK_TEMPLATES_DATA_KEY]: JSON.stringify([
        blockTemplate1,
        blockTemplate2,
      ]),
    });

    expect(getBlockTemplatesFromDataTransfer(dataTransfer)).toEqual([
      blockTemplate1,
      blockTemplate2,
    ]);
  });
});
