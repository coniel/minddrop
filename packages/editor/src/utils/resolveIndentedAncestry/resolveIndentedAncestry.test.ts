import { describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import { resolveIndentedAncestry } from './resolveIndentedAncestry';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const item3: ListItemFrame = { ...item1, id: 'item-3' };

const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

describe('resolveIndentedAncestry', () => {
  it('nests an item inside the item above it', () => {
    expect(resolveIndentedAncestry([item2], [item1])).toEqual([item1, item2]);
  });

  it('nests an item alongside the items already nested above it', () => {
    // The block above is a nested item, so the item joins it rather than
    // nesting inside it
    expect(resolveIndentedAncestry([item3], [item1, item2])).toEqual([
      item1,
      item3,
    ]);
  });

  it('carries a quote down a level with it', () => {
    expect(resolveIndentedAncestry([quote1], [item1])).toEqual([item1, quote1]);
  });

  it('pulls a plain block into the container above it', () => {
    expect(resolveIndentedAncestry([], [item1])).toEqual([item1]);
  });

  it('does not indent the first item of a list', () => {
    expect(resolveIndentedAncestry([item1], [])).toBeNull();
  });

  it('does not indent a block at the top of the document', () => {
    expect(resolveIndentedAncestry([], [])).toBeNull();
  });

  it("does not indent a block past its own container's depth", () => {
    // A second block of the same item has no deeper container to join
    expect(resolveIndentedAncestry([item1], [item1])).toBeNull();
  });
});
