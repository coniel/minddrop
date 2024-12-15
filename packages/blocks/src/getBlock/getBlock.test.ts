import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BlocksStore } from '../BlocksStore';
import { block1, block2, blocks, cleanup } from '../test-utils';
import { getBlock } from './getBlock';

describe('getBlock', () => {
  beforeEach(() => {
    BlocksStore.getState().load(blocks);
  });

  afterEach(cleanup);

  it('returns a block', () => {
    expect(getBlock(block1.id)).toEqual(block1);
  });

  it('returns null if a block not found', () => {
    expect(getBlock('unknown')).toBeNull();
  });

  it('returns an array of blocks', () => {
    expect(getBlock([block1.id, block2.id])).toEqual([block1, block2]);
  });

  it('returns an array of blocks omitting any that are not found', () => {
    expect(getBlock([block1.id, 'unknown'])).toEqual([block1]);
  });
});
