import { describe, expect, it } from 'vitest';
import { ListItemFrame } from '@minddrop/ast';
import { resolveOutdentedAncestry } from './resolveOutdentedAncestry';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

describe('resolveOutdentedAncestry', () => {
  it('lifts an item out to sit alongside the item which held it', () => {
    expect(resolveOutdentedAncestry([item1, item2], [item1])).toEqual([item2]);
  });

  it('lifts a top level item out of its list', () => {
    expect(resolveOutdentedAncestry([item1], [])).toEqual([]);
  });

  it('leaves the container from a block which did not open it', () => {
    // A second block of a nested item, which is not the item itself
    expect(resolveOutdentedAncestry([item1, item2], [item1, item2])).toEqual([
      item1,
    ]);
  });

  it('does nothing to a block in no container', () => {
    expect(resolveOutdentedAncestry([], [])).toBeNull();
  });
});
