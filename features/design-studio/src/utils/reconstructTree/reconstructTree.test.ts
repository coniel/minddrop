import { describe, expect, it } from 'vitest';
import { flatTree, testDesign } from '../../test-utils';
import { reconstructTree } from './reconstructTree';

describe('reconstructTree', () => {
  it('reconstructs an element map into a design element tree', () => {
    const parsedElementTree = reconstructTree(flatTree);

    expect(parsedElementTree).toEqual(testDesign.rootElement);
  });
});
