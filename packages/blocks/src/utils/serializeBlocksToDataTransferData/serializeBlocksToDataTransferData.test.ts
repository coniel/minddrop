import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, block1, block2 } from '../../test-utils';
import { serializeBlocksToDataTransferData } from './serializeBlocksToDataTransferData';
import { BLOCKS_DATA_KEY } from '../../constants';

describe('serializeBlocksToDataTransferData', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('serializes blocks to JSON string', () => {
    const result = serializeBlocksToDataTransferData([block1, block2]);

    expect(result[BLOCKS_DATA_KEY]).toBe(JSON.stringify([block1, block2]));
  });

  it('merges block texts to text/plain', () => {
    const result = serializeBlocksToDataTransferData([
      block1,
      { ...block1, id: 'another-text-block' },
      block2,
    ]);

    // Block 2 has no text, so it should be ignored
    expect(result['text/plain']).toBe(`${block1.text}\n\n${block1.text}`);
  });
});