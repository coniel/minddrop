import { describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  paragraphElement4,
} from '../../test-utils';
import { resolveNestedBlockIndexes } from './resolveNestedBlockIndexes';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

describe('resolveNestedBlockIndexes', () => {
  it('returns nothing for a block in no container', () => {
    const elements = [paragraphElement1, paragraphElement2];

    expect(resolveNestedBlockIndexes(elements, 0)).toEqual([]);
  });

  it('returns the run of blocks inside the containers', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      // A second block of the same item
      { ...paragraphElement2, ancestry: [item1] },
      // A child item nested inside it
      { ...paragraphElement3, ancestry: [item1, item2] },
    ];

    expect(resolveNestedBlockIndexes(elements, 0)).toEqual([1, 2]);
  });

  it('ends the run at the first block which leaves the containers', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item1] },
      // A sibling item, which sits outside the first
      { ...paragraphElement3, ancestry: [item2] },
      paragraphElement4,
    ];

    expect(resolveNestedBlockIndexes(elements, 0)).toEqual([1]);
  });

  it('does not resume the run after a break in it', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      // A block outside the item interrupts the run
      paragraphElement2,
      { ...paragraphElement3, ancestry: [item1] },
    ];

    expect(resolveNestedBlockIndexes(elements, 0)).toEqual([]);
  });

  it('requires every container, not just the innermost', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [quote1, item1] },
      // The same item held by a different quote is not nested inside it
      { ...paragraphElement2, ancestry: [{ ...quote1, id: 'quote-2' }, item1] },
    ];

    expect(resolveNestedBlockIndexes(elements, 0)).toEqual([]);
  });

  it('matches containers by identity rather than depth alone', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      // A deeper ancestry led by a different item is not nested
      { ...paragraphElement2, ancestry: [item2, item1] },
    ];

    expect(resolveNestedBlockIndexes(elements, 0)).toEqual([]);
  });
});
