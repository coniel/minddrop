import { afterEach, describe, expect, it } from 'vitest';
import { BlockquoteFrame, ListItemFrame } from '@minddrop/ast';
import {
  cleanup,
  createTestEditor,
  getAncestry,
  paragraphElement1,
  paragraphElement2,
} from '../test-utils';
import { pushFrame } from './pushFrame';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const orderedItem: ListItemFrame = {
  id: 'item-2',
  kind: 'list-item',
  ordered: true,
  marker: '1.',
};

const quote1: BlockquoteFrame = { id: 'quote-1', kind: 'blockquote' };

describe('pushFrame', () => {
  afterEach(cleanup);

  it('draws the container around a plain block', () => {
    const editor = createTestEditor([paragraphElement1]);

    pushFrame(editor, [0], item1);

    expect(getAncestry(editor, 0)).toEqual([item1]);
  });

  it('nests the container inside the block’s existing ones', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [quote1] },
    ]);

    pushFrame(editor, [0], item1);

    expect(getAncestry(editor, 0)).toEqual([quote1, item1]);
  });

  it('nests a quote inside a list item', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
    ]);

    pushFrame(editor, [0], quote1);

    expect(getAncestry(editor, 0)).toEqual([item1, quote1]);
  });

  it('respells a list item rather than nesting an item inside it', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
    ]);

    pushFrame(editor, [0], orderedItem);

    // The item takes the new markers but keeps its identity
    expect(getAncestry(editor, 0)).toEqual([{ ...orderedItem, id: item1.id }]);
  });

  it('respells the item across every block it holds', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      // A second block of the same item
      { ...paragraphElement2, ancestry: [item1] },
    ]);

    pushFrame(editor, [0], orderedItem);

    expect(getAncestry(editor, 1)).toEqual([{ ...orderedItem, id: item1.id }]);
  });

  it('does nothing for a path outside the document', () => {
    const editor = createTestEditor([paragraphElement1]);

    pushFrame(editor, [4], item1);

    expect(getAncestry(editor, 0)).toBeUndefined();
  });
});
