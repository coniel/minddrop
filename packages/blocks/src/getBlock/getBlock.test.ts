import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { cleanup, blocks, block1 } from '../test-utils';
import { getBlock } from './getBlock';
import { BlocksStore } from '../BlocksStore';

describe('getBlock', () => {
  beforeEach(() => {
    BlocksStore.getState().load(blocks);
  });

  afterEach(cleanup);

  it('returns the block', () => {
    expect(getBlock(block1.id)).toEqual(block1);
  });

  it('returns null if block not found', () => {
    expect(getBlock('unknown')).toBeNull();
  });
});
