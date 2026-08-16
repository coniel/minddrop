import { describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import { resolveMenuItemAncestry } from './resolveMenuItemAncestry';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const newItem: ListItemFrame = { ...item1, id: 'item-3' };

const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

describe('resolveMenuItemAncestry', () => {
  it('gives up the list item a plain type replaces', () => {
    // A child item turned into plain text keeps its depth but stops being
    // an item of its own
    expect(resolveMenuItemAncestry([item1, item2], true)).toEqual([item1]);
  });

  it('keeps a block in the containers around it', () => {
    // A quote is not the block's own container, so a plain type stays in it
    expect(resolveMenuItemAncestry([quote1], true)).toEqual([quote1]);
  });

  it('leaves a block which opens no container of its own', () => {
    // A second block of an item is not the item, so it has nothing to give up
    expect(resolveMenuItemAncestry([item1], false)).toEqual([item1]);
  });

  it('replaces the list item a container entry provides one for', () => {
    expect(resolveMenuItemAncestry([item1, item2], true, newItem)).toEqual([
      item1,
      newItem,
    ]);
  });

  it('nests a container entry inside the containers around it', () => {
    expect(resolveMenuItemAncestry([quote1], true, newItem)).toEqual([
      quote1,
      newItem,
    ]);
  });

  it('leaves a block at the top of the document alone', () => {
    expect(resolveMenuItemAncestry([], false)).toEqual([]);
  });
});
