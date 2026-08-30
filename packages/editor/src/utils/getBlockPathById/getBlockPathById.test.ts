import { describe, expect, it } from 'vitest';
import {
  createTestEditor,
  paragraphElement1,
  paragraphElement2,
} from '../../test-utils';
import { assignBlockIds } from '../../withBlockIds';
import { hasBlockId } from '../block-id';
import { getBlockPathById } from './getBlockPathById';

describe('getBlockPathById', () => {
  it('returns the path of the block carrying the ID', () => {
    const elements = assignBlockIds([paragraphElement1, paragraphElement2]);
    const editor = createTestEditor(elements);
    const block = elements[1];

    // The elements were just given IDs, so the guard always passes
    if (!hasBlockId(block)) {
      throw new Error('Expected the block to carry an ID');
    }

    expect(getBlockPathById(editor, block.id)).toEqual([1]);
  });

  it('returns null when no block carries the ID', () => {
    const editor = createTestEditor(assignBlockIds([paragraphElement1]));

    expect(getBlockPathById(editor, 'missing-block-id')).toBeNull();
  });
});
