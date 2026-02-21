import { describe, expect, it } from 'vitest';
import { flatTree, testDesign } from '../../test-utils';
import { flattenTree } from './flattenTree';

describe('flattenTree', () => {
  it('flattens a design element tree into a [id]: [element] map', () => {
    const parsedElementTree = flattenTree(testDesign.rootElement);

    expect(parsedElementTree).toEqual(flatTree);
  });
});
