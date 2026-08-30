import { describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../../test-utils';
import { opensInnermostFrame } from './opensInnermostFrame';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

describe('opensInnermostFrame', () => {
  it('returns false for a block in no container', () => {
    const elements = [paragraphElement1];

    expect(opensInnermostFrame(elements, 0)).toBe(false);
  });

  it('returns true for the first block of a container', () => {
    const elements = [
      paragraphElement1,
      { ...paragraphElement2, ancestry: [item1] },
    ];

    expect(opensInnermostFrame(elements, 1)).toBe(true);
  });

  it('returns false for a later block of the same container', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item1] },
    ];

    expect(opensInnermostFrame(elements, 1)).toBe(false);
  });

  it('returns true for a container opened inside another', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      // A quote nested inside the item, opened by this block
      { ...paragraphElement2, ancestry: [item1, quote1] },
    ];

    expect(opensInnermostFrame(elements, 1)).toBe(true);
  });

  it('returns true for a sibling container at the same depth', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      // A new item at the same depth is opened by its first block
      { ...paragraphElement2, ancestry: [item2] },
      { ...paragraphElement3, ancestry: [item2] },
    ];

    expect(opensInnermostFrame(elements, 1)).toBe(true);
    expect(opensInnermostFrame(elements, 2)).toBe(false);
  });
});
