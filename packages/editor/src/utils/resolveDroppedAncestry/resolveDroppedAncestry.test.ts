import { describe, expect, it } from 'vitest';
import { ListItemFrame } from '@minddrop/ast';
import { resolveDroppedAncestry } from './resolveDroppedAncestry';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

describe('resolveDroppedAncestry', () => {
  it('lands a container alongside the one it drops below', () => {
    expect(resolveDroppedAncestry([item1, item2], true)).toEqual([item1]);
  });

  it('lands a container at the top when it drops below a plain block', () => {
    expect(resolveDroppedAncestry([], true)).toEqual([]);
  });

  it('lands a plain block inside the containers it drops into', () => {
    expect(resolveDroppedAncestry([item1, item2], false)).toEqual([
      item1,
      item2,
    ]);
  });
});
