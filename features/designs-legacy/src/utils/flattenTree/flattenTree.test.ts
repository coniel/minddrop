import { describe, expect, it } from 'vitest';
import { flatTree, testLayout } from '../../test-utils';
import { flattenTree } from './flattenTree';

describe('flattenTree', () => {
  it('flattens a design element tree into a [id]: [element] map', () => {
    const parsedElementTree = flattenTree(testLayout.tree);

    expect(parsedElementTree).toEqual(flatTree);
  });
});
