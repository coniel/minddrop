import { describe, expect, it } from 'vitest';
import { ListItemFrame } from '@minddrop/ast';
import { createTestEditor, getAncestry } from '../test-utils';
import {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
} from '../test-utils/editor.fixtures';
import { outdentBlocks } from './outdentBlocks';

const item1: ListItemFrame = {
  id: 'item-1',
  kind: 'list-item',
  ordered: false,
  marker: '-',
};

const item2: ListItemFrame = { ...item1, id: 'item-2' };

describe('outdentBlocks', () => {
  it('lifts an item out of the item containing it', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item1, item2] },
    ]);

    outdentBlocks(editor, [[1]]);

    expect(getAncestry(editor, 1)).toEqual([item2]);
  });

  it('leaves a continuation block in the item around it', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1, item2] },
      { ...paragraphElement2, ancestry: [item1, item2] },
    ]);

    outdentBlocks(editor, [[1]]);

    expect(getAncestry(editor, 1)).toEqual([item1]);
  });

  it('carries the blocks nested inside it along', () => {
    const editor = createTestEditor([
      { ...paragraphElement1, ancestry: [item1] },
      { ...paragraphElement2, ancestry: [item1, item2] },
      { ...paragraphElement3, ancestry: [item1, item2] },
    ]);

    outdentBlocks(editor, [[1]]);

    expect(getAncestry(editor, 2)).toEqual([item2]);
  });

  it('leaves a block which sits in no container', () => {
    const editor = createTestEditor([paragraphElement1]);

    outdentBlocks(editor, [[0]]);

    expect(getAncestry(editor, 0)).toBeUndefined();
  });
});
