import { afterEach, describe, expect, it } from 'vitest';
import { Frame, ListItemFrame } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  getAncestry,
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../test-utils';
import { applyAncestryChanges } from './applyAncestryChanges';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

// Nests a block inside the containers of the block above it
function nestInPrevious(
  ancestry: Frame[],
  previousAncestry: Frame[],
): Frame[] | null {
  return [...previousAncestry.slice(0, 1), ...ancestry];
}

describe('applyAncestryChanges', () => {
  afterEach(cleanup);

  it('applies the resolved containers to the moved blocks', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
    ]);

    applyAncestryChanges(editor, [[1]], nestInPrevious);

    expect(getAncestry(editor, 1)).toEqual([item1, item2]);
  });

  it('moves the blocks nested inside a moved block along with it', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      // A second block of the moved item
      { ...paragraphElement3, ancestry: [item2] },
    ]);

    applyAncestryChanges(editor, [[1]], nestInPrevious);

    expect(getAncestry(editor, 2)).toEqual([item1, item2]);
  });

  it('leaves blocks put when the resolver refuses the move', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
    ]);

    applyAncestryChanges(editor, [[1]], () => null);

    expect(getAncestry(editor, 1)).toEqual([item2]);
  });

  it('moves several selected blocks together', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item2] },
      { ...paragraphElement3, ancestry: [{ ...item1, id: 'item-3' }] },
    ]);

    applyAncestryChanges(editor, [[1], [2]], nestInPrevious);

    // Both become children of the item above them
    expect(getAncestry(editor, 1)).toEqual([item1, item2]);
    expect(getAncestry(editor, 2)).toEqual([item1, { ...item1, id: 'item-3' }]);
  });
});
