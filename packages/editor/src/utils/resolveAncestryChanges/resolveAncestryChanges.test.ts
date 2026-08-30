import { describe, expect, it } from 'vitest';
import { Frame, ListItemFrame } from '@minddrop/ast';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../../test-utils';
import { resolveAncestryChanges } from './resolveAncestryChanges';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };
const item3: ListItemFrame = { ...item1, id: 'item-3' };

// Nests a block inside the containers of the block above it
function nestInPrevious(
  ancestry: Frame[],
  previousAncestry: Frame[],
): Frame[] | null {
  return [...previousAncestry.slice(0, 1), ...ancestry];
}

describe('resolveAncestryChanges', () => {
  it('resolves the new containers of a moved block', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
    ];

    const changes = resolveAncestryChanges(elements, [1], nestInPrevious);

    expect(changes.get(1)).toEqual([item1, item2]);
  });

  it('leaves a block put when the resolver refuses the move', () => {
    const elements = [{ ...paragraphElement1, ancestry: [item1] }];

    const changes = resolveAncestryChanges(elements, [0], () => null);

    expect(changes.size).toBe(0);
  });

  it('carries the blocks nested inside a moved block along', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      // A child item of the moved one, which keeps its own container
      { ...paragraphElement3, ancestry: [item2, item3] },
    ];

    const changes = resolveAncestryChanges(elements, [1], nestInPrevious);

    expect(changes.get(2)).toEqual([item1, item2, item3]);
  });

  it('reads the block above as it stands after its own move', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      { ...paragraphElement3, ancestry: [item3] },
    ];

    const changes = resolveAncestryChanges(elements, [1, 2], nestInPrevious);

    // The third block reads the second's resolved ancestry rather than the
    // one it holds in the document
    expect(changes.get(1)).toEqual([item1, item2]);
    expect(changes.get(2)).toEqual([item1, item3]);
  });

  it('does not move a nested block twice', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      // A second block of the moved item, also named in the move
      { ...paragraphElement3, ancestry: [item2] },
    ];

    const changes = resolveAncestryChanges(elements, [1, 2], nestInPrevious);

    // The block already moved as part of the item, so it follows it rather
    // than resolving a move of its own
    expect(changes.get(2)).toEqual([item1, item2]);
  });

  it('resolves indexes in document order regardless of the given order', () => {
    const elements = [
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      { ...paragraphElement3, ancestry: [item3] },
    ];

    const changes = resolveAncestryChanges(elements, [2, 1], nestInPrevious);

    expect(changes.get(1)).toEqual([item1, item2]);
    expect(changes.get(2)).toEqual([item1, item3]);
  });

  it('ignores an index outside the document', () => {
    const elements = [{ ...paragraphElement1, ancestry: [item1] }];

    const changes = resolveAncestryChanges(elements, [4], nestInPrevious);

    expect(changes.size).toBe(0);
  });
});
