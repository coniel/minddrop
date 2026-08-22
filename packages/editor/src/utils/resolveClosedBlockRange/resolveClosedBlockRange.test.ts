import { describe, expect, it } from 'vitest';
import { Element, ListItemFrame } from '@minddrop/ast';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../../test-utils/editor.fixtures';
import { resolveClosedBlockRange } from './resolveClosedBlockRange';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

// A list item with a child item and a grandchild item
const elements: Element[] = [
  { ...paragraphElement1, ancestry: [item1] },
  { ...paragraphElement2, ancestry: [item1, item2] },
  { ...paragraphElement3 },
];

describe('resolveClosedBlockRange', () => {
  it('draws in the blocks nested inside the range', () => {
    expect(
      resolveClosedBlockRange(elements, { firstIndex: 0, lastIndex: 0 }),
    ).toEqual({ firstIndex: 0, lastIndex: 1 });
  });

  it('leaves a nested block selected on its own', () => {
    expect(
      resolveClosedBlockRange(elements, { firstIndex: 1, lastIndex: 1 }),
    ).toEqual({ firstIndex: 1, lastIndex: 1 });
  });

  it('leaves a range which sits in no container', () => {
    expect(
      resolveClosedBlockRange(elements, { firstIndex: 2, lastIndex: 2 }),
    ).toEqual({ firstIndex: 2, lastIndex: 2 });
  });
});
