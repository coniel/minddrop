import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { cleanup, blocks, block1, block2 } from '../test-utils';
import { getBlock } from './getBlock';
import { BlocksStore } from '../BlocksStore';

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
